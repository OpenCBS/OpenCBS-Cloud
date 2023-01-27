package com.opencbs.loans.services.loancloseday;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.AccountRuleType;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.EventGroupKeyService;
import com.opencbs.core.services.schedulegenerators.ScheduleGenerator;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import com.opencbs.core.services.schedulegenerators.ScheduleService;
import com.opencbs.loans.annotations.CustomLoanAccrualInterestDayClosure;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanEventInterestAccrual;
import com.opencbs.loans.domain.LoanInfo;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.repositories.LoanAccountRepository;
import com.opencbs.loans.repositories.LoanEventInterestAccrualRepository;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.services.LoanEventService;
import com.opencbs.loans.services.LoanService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.chrono.ChronoLocalDate;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@ConditionalOnMissingBean(annotation = CustomLoanAccrualInterestDayClosure.class)
public class LoanInterestAccrualServerDayClosureProcessor implements LoanDayClosureProcessor {

    private final static BigDecimal DAYS_IN_YEAR = BigDecimal.valueOf(360);

    private final EventGroupKeyService eventGroupKeyService;
    private final LoanInstallmentRepository installmentRepository;
    private final LoanEventService loanEventService;
    private final LoanEventInterestAccrualRepository loanEventInterestAccrualRepository;
    private final LoanAccountRepository loanAccountRepository;
    private final AccountingEntryService accountingEntryService;
    private final LoanService loanService;
    private final ScheduleService scheduleService;

    @Override
    public void processContract(@NonNull Long loanId, @NonNull LocalDate closureDate, @NonNull User currentUser) {
        LocalDateTime closureDateTime = closureDate.atTime(getProcessType().getOperationTime());
        List<LoanInstallment> defaultInstallments = installmentRepository.findByLoanIdAndDateTime(loanId, closureDateTime);

        Optional<LoanInstallment> accruedInstallment = defaultInstallments.stream().
                filter(loanInstallment -> DateHelper.greaterOrEqual(loanInstallment.getMaturityDate(), closureDate))
                .min(Comparator.comparingInt(LoanInstallment::getNumber));

        Integer installmentNumber = defaultInstallments.size();
        if (accruedInstallment.isPresent()) {
            installmentNumber = accruedInstallment.get().getNumber();
        }

        List<LoanInstallment> installments = installmentRepository.findByLoanIdAndDateTime(loanId, closureDateTime)
                .stream()
                .filter(x -> x.getAccruedInterest().compareTo(x.getInterest()) < 0)
                .collect(Collectors.toList());

        ScheduleGeneratorTypes scheduleType = this.loanService.findOne(loanId).get().getLoanApplication().getScheduleType();
        ScheduleGenerator scheduleGenerator = this.scheduleService.getScheduleByType(scheduleType);
        LocalDate lastAccrualDate = installments
                .stream()
                .sorted(Comparator.comparing(LoanInstallment::getLastAccrualDate))
                .filter(x -> x.getLastAccrualDate().compareTo(ChronoLocalDate.from(closureDateTime.minusDays(1))) > 0)
                .map(LoanInstallment::getLastAccrualDate)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Installment not found"));

        Optional<BigDecimal> optionalInterestAmount = this.getInterestAmount(loanId, closureDateTime);
        if (!optionalInterestAmount.isPresent()) {
            return;
        }

        BigDecimal interestAmount = optionalInterestAmount.get();

        if (scheduleGenerator.getIfFact() && closureDateTime.toLocalDate().equals(lastAccrualDate)) {
            interestAmount = this.getPlannedAmount(loanId, installments, installmentNumber);
        }

        LoanEvent event = new LoanEvent();
        event.setCreatedAt(DateHelper.getLocalDateTimeNow());
        event.setEffectiveAt(getEffectiveAtDate(loanId, closureDateTime.toLocalDate()));
        event.setSystem(true);
        event.setEventType(EventType.ACCRUAL_OF_INTEREST);
        event.setLoanId(loanId);
        event.setCreatedById(UserHelper.getCurrentUser().getId());
        event.setInstallmentNumber(installmentNumber);
        event.setAmount(interestAmount);
        event.setGroupKey(eventGroupKeyService.getNextEventGroupKey());

        loanEventService.saveWithoutAnalytic(event);
        createAccountingEntry(loanId, event);
    }

    @Override
    public ProcessType getProcessType() {
        return ProcessType.LOAN_INTEREST_ACCRUAL;
    }

    @Override
    public String getIdentityString() {
        return "loan.interest-accrual";
    }

    private Optional<BigDecimal> getInterestAmount(Long loanId, LocalDateTime closureDateTime) {
        return this.getAccrualAmount(loanId, closureDateTime.toLocalDate());
    }

    private Optional<BigDecimal> getAccrualAmount(Long loanId, LocalDate closureDate) {
        if (closureDate.getDayOfMonth() > 30) {
            return Optional.empty();
        }

        LocalDate lastPrincipalRepaymentDate = this.getLastRepaymentPrincipalDate(loanId, closureDate);
        final BigDecimal accruedInterest = this.loanEventService.getEventsBetweenDates(loanId, EventType.ACCRUAL_OF_INTEREST, lastPrincipalRepaymentDate.plusDays(1L), closureDate.plusDays(1L))
                .stream()
                .map(LoanEvent::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        final LoanInfo loanInfo = this.loanService.getLoanInfo(loanId, closureDate);
        final BigDecimal percentInDay = this.calculateInterest(loanInfo.getOlb(), this.loanService.getLoanById(loanId).getInterestRate(), DAYS_IN_YEAR);

        BigDecimal needInterest = percentInDay.multiply(BigDecimal.valueOf(DateHelper.daysBetweenAs_30_360(lastPrincipalRepaymentDate, closureDate)));
        BigDecimal interest = needInterest.subtract(accruedInterest).setScale(2, RoundingMode.HALF_UP);

        if (BigDecimal.ZERO.compareTo(interest)==0) {
            return Optional.empty();
        }

        return Optional.of(interest);
    }

    private LocalDate getLastRepaymentPrincipalDate(Long loanId, LocalDate date) {
        final LocalDateTime dateTime  = LocalDateTime.of(date, LocalTime.MAX);

        List<EventType> eventTypes = Arrays.asList(EventType.DISBURSEMENT, EventType.REPAYMENT_OF_PRINCIPAL, EventType.RESCHEDULING);
        List<LoanEvent> eventByTypes = this.loanEventService.getEventByTypes(loanId, eventTypes);

        LoanEvent lastLoanEvent = eventByTypes.stream()
                .filter(loanEvent -> DateHelper.lessOrEqual(loanEvent.getEffectiveAt(), dateTime))
                .max(Comparator.comparing(LoanEvent::getEffectiveAt))
                .get();

        return lastLoanEvent.getEffectiveAt().toLocalDate();
    }

    private BigDecimal calculateInterest(@NonNull BigDecimal olb, @NonNull BigDecimal rate, @NonNull BigDecimal daysInYear) {
        return rate.divide(BigDecimal.valueOf(100), BigDecimal.ROUND_HALF_UP)
                .multiply(olb).divide(daysInYear, BigDecimal.ROUND_HALF_UP);
    }

    private BigDecimal getPlannedAmount(@NonNull Long loanId, @NonNull List<LoanInstallment> installments, @NonNull Integer installmentNumber) {
        BigDecimal sumOfTotalAmount = loanEventInterestAccrualRepository.findByLoanIdAndEventTypeAndInstallmentNumber(loanId, EventType.ACCRUAL_OF_INTEREST, installmentNumber)
                .stream()
                .map(LoanEventInterestAccrual::getAmount)
                .reduce(BigDecimal::add)
                .orElse(BigDecimal.ZERO);

        BigDecimal interest = installments.stream()
                .filter(x -> x.getNumber().equals(installmentNumber))
                .map(LoanInstallment::getInterest)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No installment found with number"));

        return interest.subtract(sumOfTotalAmount);
    }

    private LocalDateTime getDisbursementDate(@NonNull Long loanId) {
        return loanEventService.getDisbursementDate(loanId)
                .orElseThrow(() -> new RuntimeException("No loan events found for disbursement date"));
    }

    private LocalDateTime getEffectiveAtDate(@NonNull Long loanId, @NonNull LocalDate closureDate) {
        LocalDateTime closureDateTime = closureDate.atTime(getProcessType().getOperationTime());
        if (closureDate.compareTo(getDisbursementDate(loanId).toLocalDate()) > 0) {
            return closureDateTime;
        }

        return closureDateTime.plusMinutes(1);
    }

    private void createAccountingEntry(@NonNull Long loanId, @NonNull LoanEvent event) {
        if (BigDecimal.ZERO.compareTo(event.getAmount()) == 0) {
            return;
        }

        Optional<Account> debitAccount = loanAccountRepository.getLoanAccount(loanId, AccountRuleType.INTEREST_ACCRUAL);
        Optional<Account> creditAccount = loanAccountRepository.getLoanAccount(loanId, AccountRuleType.INTEREST_INCOME);
        if (!debitAccount.isPresent() || !creditAccount.isPresent()) {
            return;
        }

        accountingEntryService.create(
                AccountingEntry.builder()
                        .amount(event.getAmount())
                        .debitAccount(debitAccount.get())
                        .creditAccount(creditAccount.get())
                        .deleted(false)
                        .branch(UserHelper.getCurrentUser().getBranch())
                        .createdBy(UserHelper.getCurrentUser())
                        .description("Interest accrual")
                        .createdAt(event.getCreatedAt())
                        .effectiveAt(event.getEffectiveAt())
                        .build()
        );
    }
}