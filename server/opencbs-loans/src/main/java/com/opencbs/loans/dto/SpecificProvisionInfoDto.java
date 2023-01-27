package com.opencbs.loans.dto;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Builder
@Data
@EqualsAndHashCode
public class SpecificProvisionInfoDto {
    private BigDecimal value;
    private BigDecimal reserve;
    private BigDecimal specificValue;
    private BigDecimal specificReserve;
    private Boolean isSpecific;
    private Boolean isRate;
}

