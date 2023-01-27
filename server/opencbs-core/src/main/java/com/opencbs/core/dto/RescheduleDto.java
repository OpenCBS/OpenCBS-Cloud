package com.opencbs.core.dto;

import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RescheduleDto {

    private LocalDate rescheduleDate;

    private LocalDate firstInstallmentDate;

    private LocalDate maturityDate;

    private Integer maturity;

    public Integer getMaturity() {
        return (maturity==null)?0:maturity;
    }
        
    private Integer gracePeriod;

    private BigDecimal interestRate;

    private ScheduleGeneratorTypes scheduleType;
}
