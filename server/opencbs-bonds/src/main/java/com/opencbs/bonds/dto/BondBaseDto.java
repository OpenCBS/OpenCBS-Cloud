package com.opencbs.bonds.dto;

import com.opencbs.core.domain.enums.InterestScheme;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.ScheduleDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public abstract class BondBaseDto extends BaseDto {
    private String isin;
    private BigDecimal number;
    private BigDecimal interestRate;
    private BigDecimal penaltyRate;
    private LocalDate valueDate;
    private LocalDate couponDate;
    private LocalDate expireDate;
    private String frequency;
    private Integer maturity;
    private String status;
    private ScheduleDto installments;
    private InterestScheme interestScheme;
    private LocalDate sellDate;
}
