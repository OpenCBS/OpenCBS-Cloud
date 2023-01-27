package com.opencbs.bonds.services;

import com.opencbs.bonds.dayclosure.BondContainer;
import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.BondAccount;
import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.domain.BondInstallment;
import com.opencbs.bonds.domain.enums.BondStatus;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryLogService;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.dayClosure.DayClosureContract;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.DateHelper;
import org.springframework.stereotype.Service;

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
public class BondRollBackWorker {

    private final BondEventService bondEventService;
    private final BondService bondService;
    private final AccountingEntryService accountingEntryService;
    private final AccountingEntryLogService accountingEntryLogService;
    private final DayClosureContractService dayClosureContractService;
    private final BondInstallmentService bondInstallmentService;
    private final BondContainer bondContainer;

    public BondRollBackWorker(BondEventService bondEventService,
                              BondService bondService,
                              AccountingEntryService accountingEntryService,
                              AccountingEntryLogService accountingEntryLogService,
                              DayClosureContractService dayClosureContractService,
                              BondInstallmentService bondInstallmentService,
                              BondContainer bondContainer) {
        this.bondEventService = bondEventService;
        this.bondService = bondService;
        this.accountingEntryService = accountingEntryService;
        this.accountingEntryLogService = accountingEntryLogService;
        this.dayClosureContractService = dayClosureContractService;
        this.bondInstallmentService = bondInstallmentService;
        this.bondContainer = bondContainer;
    }

    public String rollback(String comment, Long bondId, User user) {
        Optional<BondEvent> lastEvent = this.bondEventService.findLastEvent(bondId);
        if (!lastEvent.isPresent()) {
            throw new RuntimeException("There are no any events that you can rollback!");
        }
        LocalDate rollbackDate = lastEvent.get().getEffectiveAt().toLocalDate();
        BondEvent lastBondEvent = lastEvent.get();

        List<BondEvent> rollbackList = this.bondEventService.findAllByBondIdAndEffectiveAt(bondId,
                LocalDateTime.of(rollbackDate, LocalTime.MIN),
                LocalDateTime.of(rollbackDate, LocalTime.MAX));
        rollbackList.sort(Comparator.comparing(BondEvent::getEffectiveAt));
        Collections.reverse(rollbackList);

        List<Long> groupKeyList = rollbackList
                .stream()
                .map(BondEvent::getGroupKey)
                .collect(Collectors.toList());

        Bond bond = this.bondService.findById(bondId);

        for (BondEvent event : rollbackList) {
            if (event.getEventType().equals(EventType.SELL)) {
                this.changeBondStatus(bond, BondStatus.IN_PROGRESS);
                List<BondInstallment> bondInstallments = this.bondService.getInstallments(bond);
                bond.getInstallments().addAll(bondInstallments);
                this.bondService.save(bond);
            }
            if (event.getEventType().equals(EventType.BOND_VALUE_DATE)) {
                bond.setValueDate(null);
                this.bondService.save(bond);
            }
            if (event.getEventType().equals(EventType.CLOSED)) {
                this.changeBondStatus(bond, BondStatus.SOLD);
            }
            this.deleteBondEvents(event, comment, user);
        }

        this.deleteAccountingEntries(bond, lastBondEvent);
        this.bondService.getInstallmentsByBond(bond)
                .stream()
                .filter(installment -> groupKeyList.contains(installment.getEventGroupKey()))
                .forEach(installment -> {
                    installment.setDeleted(true);
                    this.bondInstallmentService.save(installment);
                });
        this.updateProcessTypes(bondId, rollbackDate);

        return bond.getStatus().toString();
    }

    private void changeBondStatus(Bond bond, BondStatus status) {
        bond.setStatus(status);
        this.bondService.save(bond);
    }

    private void deleteBondEvents(BondEvent event, String comment, User user) {
        event.setRolledBackTime(DateHelper.getLocalDateTimeNow());
        event.setRolledBackBy(user);
        event.setDeleted(true);
        event.setComment(comment);
        this.bondEventService.save(event);
    }

    private void deleteAccountingEntries(Bond bond, BondEvent event) {
        List<Account> accountList = bond.getBondAccounts()
                .stream()
                .map(BondAccount::getAccount)
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

    private void updateProcessTypes(Long bondId, LocalDate date) {
        List<DayClosureContract> dayClosureContractList = new ArrayList<>();
        List<ProcessType> allProcesses = this.bondContainer.getContractProcessTypes();

        for (ProcessType processType : allProcesses) {
            DayClosureContract dayClosureContract =
                    this.dayClosureContractService.findByContractIdAndProcessType(bondId, processType);
            dayClosureContractList.add(dayClosureContract);
        }

        LocalDate actualDate = dayClosureContractList.stream().findFirst().get().getActualDate();
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
}
