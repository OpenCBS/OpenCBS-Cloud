package com.opencbs.core.dto;

import com.opencbs.core.domain.enums.StatusType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BaseProductDto extends BaseDto {

    private String name;
    private String code;
    private String scheduleType;
    private BigDecimal interestRateMin;
    private BigDecimal interestRateMax;
    private BigDecimal amountMin;
    private BigDecimal amountMax;
    private Integer maturityMin;
    private Integer maturityMax;
    private Integer gracePeriodMin;
    private Integer gracePeriodMax;
    private StatusType statusType = StatusType.ACTIVE;
}
