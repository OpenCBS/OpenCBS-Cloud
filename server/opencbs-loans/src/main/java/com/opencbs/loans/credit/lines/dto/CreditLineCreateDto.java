package com.opencbs.loans.credit.lines.dto;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.loans.domain.enums.EarlyRepaymentFeeType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
public class CreditLineCreateDto extends BaseDto {

    private Long profileId;
    private String name;
    private LocalDate startDate;
    private LocalDate lastDisbursementDate;
    private LocalDate maturityDate;
    private BigDecimal committedAmount;
    private BigDecimal disbursementAmountMin;
    private BigDecimal disbursementAmountMax;
    private Long loanProductId;
    private BigDecimal interestRateMin;
    private BigDecimal interestRateMax;
    private Set<Long> penalties;
    private BigDecimal structuringFees;
    private BigDecimal entryFees;
    private EarlyRepaymentFeeType earlyPartialRepaymentFeeType;
    private BigDecimal earlyPartialRepaymentFeeValue;
    private EarlyRepaymentFeeType earlyTotalRepaymentFeeType;
    private BigDecimal earlyTotalRepaymentFeeValue;
}
