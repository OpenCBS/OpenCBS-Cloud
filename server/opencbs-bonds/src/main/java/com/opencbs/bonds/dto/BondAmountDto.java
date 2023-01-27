package com.opencbs.bonds.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BondAmountDto {
    private BigDecimal amount;
    private BigDecimal equivalentAmount;
}
