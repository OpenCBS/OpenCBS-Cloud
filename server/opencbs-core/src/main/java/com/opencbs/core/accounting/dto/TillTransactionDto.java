package com.opencbs.core.accounting.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TillTransactionDto {
    private long currencyId;
    private BigDecimal amount;
}
