package com.opencbs.loans.services.loancloseday;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.enums.PenaltyType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.EventGroupKeyService;
import com.opencbs.core.services.schedulegenerators.ScheduleService;
import com.opencbs.loans.domain.*;
import com.opencbs.loans.repositories.LoanEventRepository;
import com.opencbs.loans.repositories.LoanPenaltyAccountRepository;
import com.opencbs.loans.repositories.LoanPenaltyEventRepository;
import com.opencbs.loans.services.LoanService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static com.opencbs.core.domain.enums.ProcessType.LOAN_PENALTY_ACCRUAL;

@Service
@RequiredArgsConstructor
public class LoanPenaltyAccrualProcessor implements LoanDayClosureProcessor {

    private final LoanService loanService;
    private final LoanPenaltyEventRepository loanPenaltyEventRepository;
    private final EventGroupKeyService eventGroupKeyService;
    private final AccountingEntryService accountingEntryService;
    private final LoanPenaltyAccountRepository loanPenaltyAccountRepository;
    private final List<PenaltyProcessor> penaltyProcessors;
    private final ScheduleService scheduleService;
    private final LoanEventRepository loanEventRepository;


    @Override
    public ProcessType getProcessType() {
        return LOAN_PENALTY_ACCRUAL;
    }

    @Override
    public String getIdentityString() {
        return "loan.penalty-accrual";
    }

    @Override
    public void processContract(@NonNull Long contractId, @NonNull LocalDate closureDate, @NonNull User user) {
        final Loan loan = this.loanService.findOne(contractId).orElseThrow(() -> new IllegalArgumentException(String.format("Not found loan with ID=%s", contractId)));
        final List<LoanApplicationPenalty> loanPenalties = loan.getLoanApplication().getLoanApplicationPenalties();
        if (loanPenalties.isEmpty()) {
            return;
        }

        // Minus day because we can calculate penalty before maturity day(to prevision day).
        final LocalDate previsionDay = closureDate.minusDays(1);
        final List<LoanInstallment> notPaidInstallments =
                this.loanService.getInstallmentsByLoan(contractId, LocalDateTime.of(closureDate, LocalTime.MAX), false, false).stream()
                .filter(li -> !li.isPaid() && DateHelper.lessOrEqual(li.getMaturityDate(), previsionDay))
                .collect(Collectors.toList());

        this.applyPenalties(loan, notPaidInstallments, loanPenalties, previsionDay);
    }

    private void applyPenalties(Loan loan, List<LoanInstallment> notPaidInstallments, List<LoanApplicationPenalty> loanPenalties, @NonNull final LocalDate date) {
        if (notPaidInstallments.isEmpty()) {
            return;
        }

        LocalDate minMaturityDate = notPaidInstallments.stream()
                .map(LoanInstallment::getMaturityDate)
                .min(Comparator.comparing(LocalDate::toEpochDay))
                .get();

        Integer lateDays = ((this.scheduleService.getScheduleByType(loan.getScheduleType()).getIfFact())?
                                DateHelper.daysBetween(minMaturityDate, date).intValue():
                                DateHelper.daysBetweenAs_30_360(minMaturityDate, date).intValue());

        List<LoanPenaltyEvent> events = new ArrayList<>();
        final Long eventGroupKey = eventGroupKeyService.getNextEventGroupKey();
        for (LoanApplicationPenalty loanApplicationPenalty : loanPenalties) {
            if (!(lateDays.compareTo(loanApplicationPenalty.getBeginPeriodDay())>=0 && lateDays.compareTo(loanApplicationPenalty.getEndPeriodDay())<=0) ) {
                continue;
            }

            lateDays = (lateDays - loanApplicationPenalty.getBeginPeriodDay()) + 1;
            BigDecimal amount = this.calculatePenalty(loan, date, lateDays, notPaidInstallments, loanApplicationPenalty);
            if (BigDecimal.ZERO.compareTo(amount)==0) {
                continue;
            }

            LoanPenaltyEvent event = this.createPenaltyEvent(amount, eventGroupKey, loan.getId(), loanApplicationPenalty, date);

            events.add(event);
            List<LoanPenaltyAccount> penaltyAccounts = this.getPenaltyAccounts(loan.getId(), loanApplicationPenalty);
            this.createAccountingEntry(event, penaltyAccounts.get(0));
        }

        this.loanPenaltyEventRepository.save(events);
    }

    private LoanPenaltyEvent createPenaltyEvent(BigDecimal amount, Long eventGroupKey, Long loanId, LoanApplicationPenalty loanApplicationPenalty, @NonNull LocalDate date) {
        LoanPenaltyEvent event = new LoanPenaltyEvent();
        event.setCreatedAt(DateHelper.getLocalDateTimeNow());
        event.setSystem(true);
        event.setEventType(EventType.ACCRUAL_OF_PENALTY);
        event.setLoanId(loanId);
        event.setCreatedById(UserHelper.getCurrentUser().getId());
        event.setGroupKey(eventGroupKey);
        event.setAmount(amount);
        event.setEffectiveAt(LocalDateTime.of(date, LOAN_PENALTY_ACCRUAL.getOperationTime()));
        event.setLoanApplicationPenaltyId(loanApplicationPenalty.getId());

        return event;
    }

    private BigDecimal calculatePenalty(Loan loan, LocalDate closureDate, Integer lateDays, List<LoanInstallment> loanInstallments, LoanApplicationPenalty loanApplicationPenalty) {
        if (lateDays < loanApplicationPenalty.getGracePeriod() ) {
            return BigDecimal.ZERO;
        }

        PenaltyProcessor processor =  this.getPenaltyProcessorByType(loanApplicationPenalty.getPenaltyType());
        BigDecimal penaltyPerDay = processor.getAmountPenalty(loan.getId(), closureDate, loanInstallments, loanApplicationPenalty);
        if (loanApplicationPenalty.getGracePeriod()==0 || this.isPenaltyWasAccrual(loanInstallments, loanApplicationPenalty)) {
            return this.getEffectivePenaltyAmount(loan.getId(), loanApplicationPenalty.getId(), lateDays, penaltyPerDay, closureDate);
        }

        return penaltyPerDay.multiply(BigDecimal.valueOf(loanApplicationPenalty.getGracePeriod()));
    }

    private BigDecimal getEffectivePenaltyAmount(Long loanId, Long penaltyId, Integer lateDays, BigDecimal penaltyPerDay, LocalDate closureDate) {
        //List<EventType> eventTypes = Arrays.asList(EventType.DISBURSEMENT, EventType.REPAYMENT_OF_PRINCIPAL, EventType.RESCHEDULING);
        //List<LoanEvent> events = this.loanEventRepository.findByLoanIdAndEventTypeInAndDeletedIsFalse(loanId, eventTypes);
        //LoanEvent lastLoanEvent = events.stream().max(Comparator.comparing(LoanEvent::getEffectiveAt)).get();

        final BigDecimal accruedPenalties = this.loanPenaltyEventRepository
                .findAllByLoanIdAndLoanApplicationPenaltyIdAndEventTypeAndDeletedFalseAndEffectiveAtAfter(loanId, penaltyId, EventType.ACCRUAL_OF_PENALTY,
                        LocalDateTime.of(closureDate.minusDays(lateDays), LocalTime.MIN))
                .stream()
                .map(LoanPenaltyEvent::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        final BigDecimal plannedPenalties = penaltyPerDay.multiply(BigDecimal.valueOf(lateDays));

        return plannedPenalties.subtract(accruedPenalties);
    }

    private List<LoanPenaltyAccount> getPenaltyAccounts(Long loanId, LoanApplicationPenalty loanApplicationPenalty) {
        LoanPenaltyAccount probe = new LoanPenaltyAccount();
        probe.setLoanId(loanId);
        probe.setLoanApplicationPenaltyId(loanApplicationPenalty.getId());

        return loanPenaltyAccountRepository.findAll(Example.of(probe));
    }

    private PenaltyProcessor getPenaltyProcessorByType(PenaltyType penaltyType) {
        for( PenaltyProcessor processor: penaltyProcessors){
            if (processor.getType().equals(penaltyType)) {
                return processor;
            }
        }

        throw new IllegalArgumentException(String.format("Penalty process for TYPE = %s not found", penaltyType));
    }

    private void createAccountingEntry(@NonNull LoanPenaltyEvent event, @NonNull LoanPenaltyAccount loanPenaltyAccount) {
        Account debitAccount = loanPenaltyAccount.getAccrualAccount();
        Account creditAccount = loanPenaltyAccount.getIncomeAccount();
        User currentUser = UserHelper.getCurrentUser();
        accountingEntryService.create(
                AccountingEntry.builder()
                        .amount(event.getAmount())
                        .debitAccount(debitAccount)
                        .creditAccount(creditAccount)
                        .deleted(false)
                        .branch(currentUser.getBranch())
                        .createdBy(currentUser)
                        .description("Penalty accrual")
                        .createdAt(event.getCreatedAt())
                        .effectiveAt(event.getEffectiveAt())
                        .build()
        );
    }

    public boolean isPenaltyWasAccrual(List<LoanInstallment> loanInstallments, LoanApplicationPenalty loanApplicationPenalty) {
        LocalDate min = loanInstallments
                .stream()
                .map(LoanInstallment::getMaturityDate)
                .min(Comparator.comparing(LocalDate::toEpochDay))
                .get();

        final boolean wasAccrual = this.loanPenaltyEventRepository.findAllByLoanIdAndLoanApplicationPenaltyId(loanInstallments.get(0).getLoanId(), loanApplicationPenalty.getId())
                .stream()
                .filter(loanEvent -> loanEvent.getEffectiveAt().compareTo(LocalDateTime.of(min, LOAN_PENALTY_ACCRUAL.getOperationTime())) > 0)
                .count() > 0;
        return wasAccrual;
    }
}
