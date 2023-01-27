package com.opencbs.loans.dto.loanapplications;

import com.opencbs.core.domain.enums.PenaltyType;
import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LoanApplicationPenaltyDto extends BaseDto {
    private String name;
    private Integer beginPeriodDay;
    private Integer endPeriodDay;
    private Integer gracePeriod;
    private PenaltyType penaltyType;
    private BigDecimal penalty;
}
