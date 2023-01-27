package com.opencbs.loans.services.repayment.impl;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanPenaltyAccount;
import com.opencbs.loans.services.LoanAccountingService;
import com.opencbs.loans.services.repayment.RepaymentEventService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepaymentEventServiceImpl implements RepaymentEventService {

    private final LoanAccountingService loanAccountingService;


    @Override
    public LoanEvent getPrincipalRepaymentEvent(@NonNull Long loanId, @NonNull Integer number, @NonNull BigDecimal amount, @NonNull LocalDateTime timestamp) {
        LoanEvent event = getEvent(EventType.REPAYMENT_OF_PRINCIPAL, number, amount, loanId, timestamp);
        List<AccountingEntry> entries = loanAccountingService.getPrincipalRepaymentAccountingEntry(amount, event);
        event.setAccountingEntry(entries);

        return event;
    }

    @Override
    public LoanEvent getPenaltyRepaymentEvent(@NonNull Long loanId, @NonNull LoanPenaltyAccount penaltyAccount, @NonNull BigDecimal amount, @NonNull LocalDateTime timestamp) {
        LoanEvent event = getEvent(EventType.REPAYMENT_OF_PENALTY, null, amount, loanId, timestamp);
        event.setLoanApplicationPenaltyId(penaltyAccount.getLoanApplicationPenaltyId());
        List<AccountingEntry> entries = loanAccountingService.getPenaltyRepaymentAccountingEntry(amount, event, penaltyAccount);
        event.setAccountingEntry(entries);

        return event;
    }

    @Override
    public LoanEvent getInterestRepaymentEvent(@NonNull Long loanId, @NonNull Integer number, @NonNull BigDecimal amount, @NonNull LocalDateTime timestamp) {
        LoanEvent event = getEvent(EventType.REPAYMENT_OF_INTEREST, number, amount, loanId, timestamp);
        List<AccountingEntry> entries = loanAccountingService.getInterestRepaymentAccountingEntry(amount, event);
        event.setAccountingEntry(entries);

        return event;
    }

    @Override
    public LoanEvent getEarlyRepaymentFeeEvent(@NonNull Long loanId, @NonNull Integer number, @NonNull BigDecimal amount, @NonNull LocalDateTime timestamp, @NonNull Boolean isTotalRepayment) {
        LoanEvent event = getEvent(EventType.OTHER_FEE_REPAY, number, amount, loanId, timestamp);
        List<AccountingEntry> entries = loanAccountingService.getEarlyRepaymentFeeAccountingEntry(amount, event, isTotalRepayment);
        event.setAccountingEntry(entries);
        event.setAccountingEntry(Collections.emptyList());

        return event;
    }

    @Override
    public LoanEvent getAccrualInterestEvent(Long loanId, Integer number, BigDecimal amount, LocalDateTime timestamp) {
        LoanEvent event = getEvent(EventType.ACCRUAL_OF_INTEREST, number, amount, loanId, timestamp);
        List<AccountingEntry> entries = loanAccountingService.getInterestAccrualAccountingEntry(amount, event);
        event.setAccountingEntry(entries);

        return event;
    }

    private LoanEvent getEvent(@NonNull EventType eventType, Integer number, @NonNull BigDecimal amount, @NonNull Long loanId, @NonNull LocalDateTime effectiveAt) {
        LoanEvent event = new LoanEvent();
        event.setEventType(eventType);
        event.setInstallmentNumber(number);
        event.setAmount(amount);
        event.setLoanId(loanId);
        event.setEffectiveAt(effectiveAt);

        return event;
    }
}
