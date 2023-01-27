package com.opencbs.loans.credit.lines.dto;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.penalty.PenaltyInfoDto;
import com.opencbs.loans.domain.enums.EarlyRepaymentFeeType;
import com.opencbs.loans.dto.products.LoanProductDetailsDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreditLineInfoDto extends BaseDto {

    private String name;
    private LocalDate startDate;
    private LocalDate lastDisbursementDate;
    private LocalDate maturityDate;
    private BigDecimal committedAmount;
    private BigDecimal disbursementAmountMin;
    private BigDecimal disbursementAmountMax;
    private LoanProductDetailsDto loanProduct;
    private BigDecimal interestRateMin;
    private BigDecimal interestRateMax;
    private List<PenaltyInfoDto> penalties;
    private BigDecimal structuringFees;
    private BigDecimal entryFees;
    private EarlyRepaymentFeeType earlyPartialRepaymentFeeType;
    private BigDecimal earlyPartialRepaymentFeeValue;
    private EarlyRepaymentFeeType earlyTotalRepaymentFeeType;
    private BigDecimal earlyTotalRepaymentFeeValue;
}
