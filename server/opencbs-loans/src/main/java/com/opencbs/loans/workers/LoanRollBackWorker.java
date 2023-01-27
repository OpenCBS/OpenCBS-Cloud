package com.opencbs.loans.workers;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryLogService;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.dayClosure.DayClosureContract;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.loans.analytics.loan.services.AnalyticsService;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanAccount;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import com.opencbs.loans.domain.enums.LoanStatus;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.services.LoanApplicationService;
import com.opencbs.loans.services.LoanEventService;
import com.opencbs.loans.services.LoanPenaltyEventService;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.services.loancloseday.LoanContainer;
import com.opencbs.loans.services.loanreschedule.StorageLoanParameter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanRollBackWorker {

    private final LoanApplicationService loanApplicationService;
    private final LoanEventService loanEventService;
    private final AccountingEntryLogService accountingEntryLogService;
    private final AccountingEntryService accountingEntryService;
    private final LoanService loanService;
    private final LoanInstallmentRepository loanInstallmentRepository;
    private final AnalyticsService analyticsService;
    private final DayClosureContractService dayClosureContractService;
    private final LoanContainer loanContainer;
    private final LoanPenaltyEventService loanPenaltyEventService;

    @Transactional
    public void rollBack(RollbackParams rollbackParams, Long loanId) {
        Loan loan = this.loanService.findOne(loanId).get();

        LocalDateTime startDateTime = rollbackParams.getDateTime();
        Optional<LoanEvent> lastEvent = this.loanEventService.findLastEvent(loan.getId());
        if (!lastEvent.isPresent()) {
            throw new RuntimeException("There are no any events that you can rollback!");
        }
        LocalDateTime endDateTime = lastEvent.get().getEffectiveAt();
        LocalTime timeMarker = startDateTime.toLocalTime();
        while (DateHelper.greater(endDateTime, startDateTime)) {
            LocalDateTime endPeriod = endDateTime;
            LocalDateTime beginPeriod = endPeriod.minusDays(1).with(timeMarker);
            rollbackByPeriod(loan, beginPeriod, endPeriod, rollbackParams.getComment());
            endDateTime = endDateTime.minusDays(1).with(timeMarker);
        }

    }

    private String rollbackByPeriod (Loan loan, LocalDateTime startDateTime, LocalDateTime endDateTime, String comment) {
        boolean isDisbursement = false;

        List<LoanEvent> rollbackList  = this.loanEventService.findAllByLoanIdAndEffectiveAt(loan.getId(),
                startDateTime,
                endDateTime
        );

        rollbackList.sort(Comparator.comparing(LoanEvent::getEffectiveAt));
        Collections.reverse(rollbackList);

        List<Long> groupKeyList = rollbackList
                .stream()
                .map(LoanEvent::getGroupKey)
                .collect(Collectors.toList());

        for (LoanEvent event : rollbackList) {
            if (event.getEventType().equals(EventType.DISBURSEMENT)) {
                this.rollBackDisbursementEvent(loan, LoanStatus.PENDING);
                isDisbursement = true;
            }
            if (event.getEventType().equals(EventType.CLOSED) || event.getEventType().equals(EventType.WRITE_OFF_OLB)) {
                this.changeLoanStatus(loan, LoanStatus.ACTIVE);
            }

            if( EventType.RESCHEDULING.equals(event.getEventType())) {
                final StorageLoanParameter storageLoanParameter = StorageLoanParameter.of(event.getExtra());
                loan.setMaturityDate(storageLoanParameter.getMaturityDate());
                loan.setMaturity(storageLoanParameter.getMaturity());
                loan.setGracePeriod(storageLoanParameter.getGracePeriod());
                loan.setInterestRate(storageLoanParameter.getInterestRate());
            }

            this.deleteLoanEvent(event, UserHelper.getCurrentUser(), comment);
        }

        this.loanPenaltyEventService.rollBackPenalties(loan.getId(), startDateTime, endDateTime);
        this.deleteAccountingEntries(rollbackList);

        //this.loanService.getInstallmentsByLoan(loan.getId(), null, true, true)
        this.loanService.getInstallmentsByLoanAndEventGroupKeys(loan.getId(), groupKeyList)
                .forEach(installment -> {
                    installment.setDeleted(true);
                    this.loanInstallmentRepository.save(installment);
                });
        this.analyticsService.deleteFutureAnalytics(endDateTime.toLocalDate(), loan.getId());
        if(!isDisbursement){
            this.updateProcessTypes(loan.getId(), endDateTime.toLocalDate().minusDays(1));
        }
        return loan.getStatus().toString();
    }

    private void rollBackDisbursementEvent(Loan loan,LoanStatus status) {
        this.changeLoanStatus(loan, status);
        this.resetCreditCommitteeVotes(loan.getLoanApplication());
    }

    private void changeLoanStatus(Loan loan, LoanStatus status) {
        loan.setStatus(status);
        this.loanService.save(loan);
    }

    private void resetCreditCommitteeVotes(LoanApplication loanApplication) {
        loanApplication.setStatus(LoanApplicationStatus.PENDING);
        loanApplication.getCreditCommitteeVotes()
                .forEach(x -> {
                    x.setStatus(LoanApplicationStatus.PENDING);
                    x.setChangedBy(null);
                    x.setNotes(null);
                    x.setCreatedAt(null);
                });
        this.loanApplicationService.save(loanApplication);
    }

    private void deleteLoanEvent(LoanEvent event, User user, String comment) {
        event.setRolledBackTime(DateHelper.getLocalDateTimeNow());
        event.setRolledBackBy(user);
        event.setDeleted(true);
        event.setComment(comment);
        this.loanEventService.saveWithoutAnalytic(event);
    }

    private void deleteAccountingEntries(List<LoanEvent> rollbackList) {
        List<AccountingEntry> accountingEntries = rollbackList.stream()
                .flatMap(loanEvent ->  loanEvent.getAccountingEntry().stream())
                .collect(Collectors.toList());

        if (CollectionUtils.isEmpty(accountingEntries)) {
            return;
        }

        accountingEntries.forEach(accountingEntry -> accountingEntry.setDeleted(true));

        AccountingEntry minAccountingEntry = accountingEntries
                .stream()
                .min(Comparator.comparing(AccountingEntry::getEffectiveAt))
                .get();

        this.accountingEntryService.save(accountingEntries);
        this.accountingEntryLogService.saveAccountingEntryLog(minAccountingEntry);
    }

    private void updateProcessTypes(Long loanId, LocalDate date) {
        List<DayClosureContract> dayClosureContractList = new ArrayList<>();
        List<ProcessType> allProcesses = this.loanContainer.getContractProcessTypes();

        for (ProcessType processType : allProcesses) {
            DayClosureContract dayClosureContract =
                    this.dayClosureContractService.findByContractIdAndProcessType(loanId, processType);
            dayClosureContractList.add(dayClosureContract);
        }

        for (DayClosureContract dayClosureContract : dayClosureContractList) {
            dayClosureContract.setActualDate(date);
            this.dayClosureContractService.save(dayClosureContract);
        }
    }

    public Set<Account> getInvolvedAccounts(Long loanId) {
        Loan loan = this.loanService.findOne(loanId).get();
        Set<Account> accounts = loan.getLoanAccountList()
                .stream()
                .map(LoanAccount::getAccount)
                .collect(Collectors.toSet());
        Account currentAcc = loan.getProfile().getCurrentAccounts().stream().filter(x -> x.getCurrency().getId().equals(loan.getCurrencyId())).findFirst().get();
        accounts.add(currentAcc);
        return accounts;
    }
}
