package com.opencbs.borrowings.services;

import com.opencbs.borrowings.dayclose.BorrowingContainer;
import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.BorrowingAccount;
import com.opencbs.borrowings.domain.BorrowingEvent;
import com.opencbs.borrowings.domain.enums.BorrowingStatus;
import com.opencbs.borrowings.domain.schedule.BorrowingInstallment;
import com.opencbs.borrowings.repositories.BorrowingInstallmentRepository;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryLogService;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.dayClosure.DayClosureContract;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.DateHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BorrowingOperationsService {

    private final BorrowingService borrowingService;
    private final BorrowingAccountingService borrowingAccountingService;
    private final BorrowingEventService borrowingEventService;
    private final BorrowingInstallmentRepository borrowingInstallmentRepository;
    private final DayClosureContractService dayClosureContractService;
    private final AccountingEntryService accountingEntryService;
    private final AccountingEntryLogService accountingEntryLogService;
    private final BorrowingContainer borrowingContainer;

    public BorrowingOperationsService(BorrowingService borrowingService,
                                      BorrowingAccountingService borrowingAccountingService,
                                      BorrowingEventService borrowingEventService,
                                      BorrowingInstallmentRepository borrowingInstallmentRepository,
                                      DayClosureContractService dayClosureContractService,
                                      AccountingEntryService accountingEntryService,
                                      AccountingEntryLogService accountingEntryLogService,
                                      BorrowingContainer borrowingContainer) {
        this.borrowingService = borrowingService;
        this.borrowingAccountingService = borrowingAccountingService;
        this.borrowingEventService = borrowingEventService;
        this.borrowingInstallmentRepository = borrowingInstallmentRepository;
        this.dayClosureContractService = dayClosureContractService;
        this.accountingEntryService = accountingEntryService;
        this.accountingEntryLogService = accountingEntryLogService;
        this.borrowingContainer = borrowingContainer;
    }

    @Transactional
    public Borrowing rollBack(String comment, Borrowing borrowing, User user) {
        Optional<BorrowingEvent> lastEvent = this.borrowingEventService.findLastEvent(borrowing.getId());
        if (!lastEvent.isPresent()) {
            throw new RuntimeException("There are no any events that you can rollback!");
        }
        LocalDate rollbackDate = lastEvent.get().getEffectiveAt().toLocalDate();
        BorrowingEvent lastBorrowingEvent = lastEvent.get();

        List<BorrowingEvent> rollbackList = this.borrowingEventService.findByBorrowingIdAndEffectiveAt(borrowing.getId(),
                LocalDateTime.of(rollbackDate, LocalTime.MIN),
                LocalDateTime.of(rollbackDate, LocalTime.MAX));
        rollbackList.sort(Comparator.comparing(BorrowingEvent::getEffectiveAt));
        Collections.reverse(rollbackList);

        List<Long> groupKeyList = rollbackList
                .stream()
                .map(BorrowingEvent::getGroupKey)
                .collect(Collectors.toList());

        for (BorrowingEvent borrowingEvent : rollbackList) {
            if (borrowingEvent.getEventType().equals(EventType.DISBURSEMENT)) {
                this.changeBorrowingStatus(borrowing, BorrowingStatus.PENDING);
                List<BorrowingInstallment> borrowingInstallments = this.borrowingService.getInstallments(borrowing);
                borrowing.getInstallments().addAll(borrowingInstallments);
                this.borrowingService.save(borrowing);
            }
            if (borrowingEvent.getEventType().equals(EventType.CLOSED) || borrowingEvent.getEventType().equals(EventType.WRITE_OFF_OLB)) {
                this.changeBorrowingStatus(borrowing, BorrowingStatus.ACTIVE);
            }
            this.deleteBorrowingEvent(borrowingEvent, comment, user);
        }

        this.deleteAccountingEntries(borrowing, lastBorrowingEvent);
        this.borrowingService.findAllByBorrowingId(borrowing.getId())
                .stream()
                .filter(installment -> groupKeyList.contains(installment.getEventGroupKey()))
                .forEach(installment -> {
                    installment.setDeleted(true);
                    this.borrowingInstallmentRepository.save(installment);
                });
        this.updateProcessTypes(borrowing.getId(), rollbackDate);

        return borrowing;
    }

    private void changeBorrowingStatus(Borrowing borrowing, BorrowingStatus borrowingStatus){
        borrowing.setStatus(borrowingStatus);
        this.borrowingService.save(borrowing);
    }

    private void deleteBorrowingEvent(BorrowingEvent event, String comment, User user) {
        event.setComment(comment);
        event.setRolledBackTime(LocalDateTime.now());
        event.setRolledBackBy(user);
        event.setDeleted(true);
        this.borrowingEventService.save(event);
    }

    private void deleteAccountingEntries(Borrowing borrowing, BorrowingEvent event) {
        List<Account> accountList = borrowing.getBorrowingAccounts()
                .stream()
                .map(BorrowingAccount::getAccount)
                .collect(Collectors.toList());

        List<AccountingEntry> accountingEntryList = new ArrayList<>();

        for (Account account : accountList) {
            accountingEntryList.addAll(this.accountingEntryService.getAccountingEntriesByAccount(account,
                    LocalDateTime.of(event.getEffectiveAt().toLocalDate(), LocalTime.MIN),
                    LocalDateTime.of(event.getEffectiveAt().toLocalDate(), LocalTime.MAX)));
        }

        if (accountingEntryList.isEmpty()) {
            return;
        }

        for (AccountingEntry accountingEntry : accountingEntryList) {
            accountingEntry.setDeleted(true);
            this.accountingEntryService.save(accountingEntry);
        }

        AccountingEntry entry = accountingEntryList
                .stream()
                .sorted(Comparator.comparing(AccountingEntry::getEffectiveAt))
                .findFirst()
                .get();

        this.accountingEntryLogService.saveAccountingEntryLog(entry);
    }

    private void updateProcessTypes(Long borrowingId, LocalDate date) {
        List<DayClosureContract> dayClosureContractList = new ArrayList<>();
        List<ProcessType> allProcesses = this.borrowingContainer.getContractProcessTypes();

        for (ProcessType processType : allProcesses) {
            DayClosureContract dayClosureContract =
                    this.dayClosureContractService.findByContractIdAndProcessType(borrowingId, processType);
            dayClosureContractList.add(dayClosureContract);
        }

        LocalDate actualDate =  dayClosureContractList.stream().findFirst().get().getActualDate();
        Boolean isDate = dayClosureContractList
                .stream()
                .allMatch(x -> x.getActualDate().equals(actualDate));

        if (!isDate) {
            throw new RuntimeException(String.format("The contract isn't actualized"));
        }

        if (DateHelper.lessOrEqual(date, actualDate)) {
            for (DayClosureContract dayClosureContract : dayClosureContractList) {
                dayClosureContract.setActualDate(date.minusDays(1));
                this.dayClosureContractService.save(dayClosureContract);
            }
        }
    }

    @Transactional
    public Borrowing disburse(Borrowing borrowing, User user) {
        borrowing.setStatus(BorrowingStatus.ACTIVE);
        this.borrowingService.save(borrowing);
        BorrowingEvent disbursementEvent = this.borrowingService.createBorrowingDisbursementEvent(borrowing, user);
        this.borrowingService.saveBorrowingSchedule(borrowing, disbursementEvent);
        this.borrowingAccountingService.createBorrowingDisbursementAccountingEntry(disbursementEvent);
        this.borrowingEventService.save(disbursementEvent);
        this.updateDayClosureContract(borrowing, disbursementEvent.getEffectiveAt().toLocalDate(), user.getBranch());

        return borrowing;
    }

    private void updateDayClosureContract(Borrowing borrowing, LocalDate date, Branch branch) {
        for (ProcessType containerType : this.borrowingContainer.getContractProcessTypes()) {
            this.dayClosureContractService.updateDayClosureContract(borrowing.getId(), containerType, date, branch);
        }
    }
}
