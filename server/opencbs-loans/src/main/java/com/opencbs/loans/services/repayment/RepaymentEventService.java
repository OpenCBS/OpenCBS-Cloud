package com.opencbs.loans.services.repayment;

import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanPenaltyAccount;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface RepaymentEventService {

    LoanEvent getPrincipalRepaymentEvent(Long loanId, Integer number, BigDecimal amount, LocalDateTime timestamp);

    LoanEvent getPenaltyRepaymentEvent(Long loanId, LoanPenaltyAccount penaltyAccount, BigDecimal amount, LocalDateTime timestamp);

    LoanEvent getInterestRepaymentEvent(Long loanId, Integer number, BigDecimal amount, LocalDateTime timestamp);

    LoanEvent getEarlyRepaymentFeeEvent(Long loanId, Integer number, BigDecimal amount, LocalDateTime timestamp, Boolean isTotalRepayment);

    LoanEvent getAccrualInterestEvent(Long loanId, Integer number, BigDecimal amount, LocalDateTime timestamp);
}
