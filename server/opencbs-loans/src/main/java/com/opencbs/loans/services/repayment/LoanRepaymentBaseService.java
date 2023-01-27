package com.opencbs.loans.services.repayment;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.BaseInstallment;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.EventGroupKeyService;
import com.opencbs.loans.domain.*;
import com.opencbs.loans.domain.enums.LoanStatus;
import com.opencbs.loans.dto.RepaymentResult;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.services.LoanAccountingService;
import com.opencbs.loans.services.LoanEventService;
import com.opencbs.loans.services.LoanPenaltyEventService;
import com.opencbs.loans.services.LoanService;
import lombok.AccessLevel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class LoanRepaymentBaseService<T extends RepaymentSplit> {

    protected final LoanInstallmentRepository loanInstallmentRepository;
    protected final LoanEventService loanEventService;
    private final EventGroupKeyService eventGroupKeyService;
    private final RepaymentEventService repaymentEventService;
    private final LoanAccountingService loanAccountingService;
    private final LoanPenaltyEventService loanPenaltyEventService;
    private final LoanService loanService;

    @PersistenceContext
    private EntityManager entityManager;


    public List<LoanInstallment> preview(@NonNull Loan loan, @NonNull T repaymentSplit) {
        RepaymentResult result = repayImpl(
                RepaymentResult.builder()
                        .loan(loan)
                        .currentUser(UserHelper.getCurrentUser())
                        .timestamp(repaymentSplit.getTimestamp())
                        .build(),
                repaymentSplit,
                false
        );

        return result.getInstallments();
    }

    @Transactional
    public RepaymentResult repay(@NonNull Loan loan, @NonNull T repaymentSplit) {
        RepaymentResult result = repayImpl(
                RepaymentResult.builder()
                        .loan(loan)
                        .currentUser(UserHelper.getCurrentUser())
                        .timestamp(repaymentSplit.getTimestamp())
                        .build(),
                repaymentSplit,
                true
        );

        save(result);
        return result;
    }

    protected abstract RepaymentResult repayImpl(RepaymentResult result, T repaymentSplit, boolean persist);

    protected void createPenaltyRepaymentEvent(@NonNull Long loanId, @NonNull BigDecimal amount, @NonNull LocalDateTime timestamp, @NonNull LoanPenaltyAccount penaltyAccount, @NonNull RepaymentResult result) {
        LoanEvent event = repaymentEventService.getPenaltyRepaymentEvent(loanId, penaltyAccount, amount, timestamp);
        result.addEvent(event);
    }

    protected void createInterestRepaymentEvent(@NonNull Long loanId, @NonNull Integer number, @NonNull BigDecimal amount, @NonNull LocalDateTime timestamp, @NonNull RepaymentResult result) {
        LoanEvent event = repaymentEventService.getInterestRepaymentEvent(loanId, number, amount, timestamp);
        result.addAffectedNumber(number);
        result.addEvent(event);
    }

    protected void createPrincipalRepaymentEvent(@NonNull Long loanId, @NonNull Integer number, @NonNull BigDecimal amount, @NonNull LocalDateTime timestamp, @NonNull RepaymentResult result) {
        LoanEvent event = repaymentEventService.getPrincipalRepaymentEvent(loanId, number, amount, timestamp);
        result.addAffectedNumber(number);
        result.addEvent(event);
    }

    protected void createEarlyRepaymentFeeEvent(@NonNull Long loanId, @NonNull Integer number, @NonNull BigDecimal amount, @NonNull LocalDateTime timestamp, @NonNull RepaymentResult result, @NonNull Boolean isTotalRepayment) {
        LoanEvent event = repaymentEventService.getEarlyRepaymentFeeEvent(loanId, number, amount, timestamp, isTotalRepayment);
        result.addAffectedNumber(number);
        result.addEvent(event);
    }

    protected void createAccrualInterestEvent(@NonNull Long loanId, @NonNull Integer number, @NonNull BigDecimal amount, @NonNull LocalDateTime timestamp, @NonNull RepaymentResult result) {
        LoanEvent event = repaymentEventService.getAccrualInterestEvent(loanId, number, amount, timestamp);
        result.addAffectedNumber(number);
        result.addEvent(event);
    }

    protected BigDecimal getMaxRepaymentAmount(@NonNull List<LoanInstallment> installments) {
        BigDecimal principal = installments.stream()
                .map(x -> x.getPrincipal().subtract(x.getPaidPrincipal()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal interest = installments.stream()
                .map(x -> x.getAccruedInterest().subtract(x.getPaidInterest()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return principal.add(interest);
    }

    private void save(RepaymentResult result) {
        result.getInstallments().forEach(x -> entityManager.detach(x));
        LocalDateTime now = DateHelper.getLocalDateTimeNow();

        Long groupKey = this.eventGroupKeyService.getNextEventGroupKey();
        Long accrualGroupKey = this.eventGroupKeyService.getNextEventGroupKey(); // get groupKey for accruals that equals groupKey + 1

        result.getInstallments()
                .stream()
                .filter(i -> result.getAffectedNumbers().contains(i.getNumber()))
                .map(LoanInstallment::new)
                .forEach(i -> {
                    i.setEventGroupKey(groupKey);
                    i.setEffectiveAt(result.getTimestamp());
                    i.setLoanId(result.getLoan().getId());
                    i.setRescheduled(false);
                    this.loanInstallmentRepository.save(i);
                });

        saveLoanEvents(result.getEvents(), now, result, groupKey, accrualGroupKey);

        // Check if the loan is fully repaid and if yes then generates the closing event
        boolean loanRepaid = result.getInstallments()
                .parallelStream()
                .allMatch(BaseInstallment::isPaid);
        if (loanRepaid) {
            this.saveCloseEvent(now, result, this.eventGroupKeyService.getNextEventGroupKey());
        }
    }

    private void saveLoanEvents(List<LoanEvent> loanEvents, LocalDateTime dateTime, RepaymentResult result, Long groupKey, Long accrualGroupKey) {
        for (LoanEvent loanEvent : loanEvents) {
            if (loanEvent.getEventType().equals(EventType.ACCRUAL_OF_INTEREST) || loanEvent.getEventType().equals(EventType.ACCRUAL_OF_PENALTY)) {
                loanEvent.setGroupKey(accrualGroupKey);
            } else {
                loanEvent.setGroupKey(groupKey);
            }

            List<AccountingEntry> entries = new ArrayList<>(loanEvent.getAccountingEntry());
            loanEvent.setAccountingEntry(new ArrayList<>());

            loanEvent.setCreatedAt(dateTime);
            loanEvent.setCreatedById(result.getCurrentUser().getId());
            loanEvent.setEffectiveAt(result.getTimestamp());
            loanEvent.setLoanId(result.getLoan().getId());
            loanEventService.save(loanEvent);

            saveLoanPenaltyRepaymentEvent(loanEvent, entries, result);

            loanAccountingService.createLoanEventAccountingEntries(
                    entries,
                    result.getCurrentUser(),
                    result.getTimestamp(),
                    loanEvent
            );
        }
    }

    private void saveLoanPenaltyRepaymentEvent(LoanEvent loanEvent, List<AccountingEntry> entries, RepaymentResult result) {
        if (!loanEvent.getEventType().equals(EventType.REPAYMENT_OF_PENALTY)){
            return;
        }

        ModelMapper modelMapper = new ModelMapper();
        LoanPenaltyEvent loanPenaltyEvent = modelMapper.map(loanEvent, LoanPenaltyEvent.class);
        loanPenaltyEvent.setLoanApplicationPenaltyId(loanEvent.getLoanApplicationPenaltyId());
        LoanPenaltyEvent event = this.loanPenaltyEventService.save(loanPenaltyEvent);
        this.loanAccountingService.createLoanPenaltyEventAccountingEntries(entries, result.getCurrentUser(), result.getTimestamp(), event);
    }

    private void saveCloseEvent(LocalDateTime dateTime, RepaymentResult result, Long groupKey) {
        LoanEvent closingEvent = new LoanEvent();
        closingEvent.setEventType(EventType.CLOSED);
        closingEvent.setCreatedAt(dateTime);
        closingEvent.setCreatedById(result.getCurrentUser().getId());
        closingEvent.setEffectiveAt(result.getTimestamp());
        closingEvent.setGroupKey(groupKey);
        closingEvent.setLoanId(result.getLoan().getId());
        closingEvent.setAmount(BigDecimal.ZERO);
        result.getLoan().setStatus(LoanStatus.CLOSED);

        loanEventService.save(closingEvent);
    }

    public boolean isNeedClose(){
        return true;
    }

    public BigDecimal getMaxRepaymentAmount(Long loanId, LocalDateTime repaymentDateTime) {
        LoanInfo loanInfo = this.loanService.getLoanInfo(loanId, repaymentDateTime.toLocalDate());
        return loanInfo.getPrincipal().add(loanInfo.getInterest()).add(loanInfo.getPenalty());
    }

    public BigDecimal getAccruedInterest(Long loanId, LocalDate repaymentDate) {
        LocalDateTime repaymentDateTime = LocalDateTime.of(repaymentDate, LocalTime.MAX);
        BigDecimal accrualInterest = this.loanEventService.findAllByLoanIdAndDeletedAndEventTypeAndDate(loanId, false, EventType.ACCRUAL_OF_INTEREST, repaymentDateTime).stream()
                .map(LoanEvent::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal paymentInterest = this.loanEventService.findAllByLoanIdAndDeletedAndEventTypeAndDate(loanId, false, EventType.REPAYMENT_OF_INTEREST, repaymentDateTime).stream()
                .map(LoanEvent::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return accrualInterest.subtract(paymentInterest);
    }

    public BigDecimal getAmountForPenalty(Long loanId, LocalDate dateTime) {
        BigDecimal paymentPenalty =
                this.loanEventService.findAllByLoanIdAndDeletedAndEventTypeAndDate(loanId,false, EventType.REPAYMENT_OF_PENALTY, LocalDateTime.of(dateTime, LocalTime.MAX)).stream()
                        .map(LoanEvent::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                ;
        return this.loanPenaltyEventService.getPenaltyAmount(loanId, dateTime)
                .subtract(paymentPenalty);
    }
}
