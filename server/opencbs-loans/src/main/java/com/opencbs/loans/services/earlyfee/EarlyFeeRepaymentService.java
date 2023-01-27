package com.opencbs.loans.services.earlyfee;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface EarlyFeeRepaymentService {

    BigDecimal getPartialRepaymentEarlyFee(Long loanId, LocalDateTime repaymentDate, BigDecimal totalAmount, BigDecimal olb);

    BigDecimal getTotalRepaymentEarlyFee(Long loanId, LocalDateTime repaymentDate, BigDecimal totalAmount, BigDecimal olb);
}
