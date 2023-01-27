package com.opencbs.core.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ScheduleParamsDto {

    private BigDecimal amount;

    private String disbursementDate;

    private String preferredRepaymentDate;

    private Integer maturity;

    private Integer gracePeriod;

    private String scheduleType;

    private BigDecimal interestRate;
}
