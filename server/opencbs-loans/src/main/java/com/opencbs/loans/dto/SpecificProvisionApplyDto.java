package com.opencbs.loans.dto;

import com.opencbs.loans.domain.enums.ProvisionType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode
public class SpecificProvisionApplyDto {
    private Long loanId;
    private BigDecimal value;
    private Boolean isRate;
    private Boolean isSpecific;
    private ProvisionType provisionType;
}