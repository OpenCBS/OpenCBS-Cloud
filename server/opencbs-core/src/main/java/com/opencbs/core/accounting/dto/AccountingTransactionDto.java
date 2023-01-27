package com.opencbs.core.accounting.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountingTransactionDto {
    private BigDecimal amount;
    private Long accountId;
    private String description;
    private String documentNumber;
}
