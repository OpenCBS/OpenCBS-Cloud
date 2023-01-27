package com.opencbs.core.dto.penalty;

import com.opencbs.core.domain.enums.PenaltyType;
import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PenaltyInfoDto extends BaseDto {
    private String name;
    private Integer beginPeriodDay;
    private Integer endPeriodDay;
    private Integer gracePeriod = 0;
    private PenaltyType penaltyType;
    private BigDecimal penalty;
    private PenaltyAccountDto accrualAccount;
    private PenaltyAccountDto incomeAccount;
    private PenaltyAccountDto writeOffAccount;
}
