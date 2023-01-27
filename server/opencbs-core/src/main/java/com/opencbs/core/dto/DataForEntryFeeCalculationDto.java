package com.opencbs.core.dto;

import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DataForEntryFeeCalculationDto extends BaseDto {
    private Long loanProduct;
    private BigDecimal amounts;
    private BigDecimal interest;
    private Integer gracePeriod;
    private Integer maturity;
    private LocalDate disbursementDate;
    private LocalDate preferredRepaymentDate;
    private ScheduleGeneratorTypes scheduleType;
}