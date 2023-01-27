package com.opencbs.loans.services.earlyfee;

import com.opencbs.loans.domain.enums.EarlyRepaymentFeeType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;

public interface EarlyFeeCalculationService {

    RoundingMode ROUND_MODE = RoundingMode.HALF_EVEN;
    int DECIMAL_PLACE = 2;


    BigDecimal getEarlyFeeAmount(Long loanId, LocalDateTime timestamp, BigDecimal totalAmount, BigDecimal olb, BigDecimal percent);

    EarlyRepaymentFeeType getType();
}
