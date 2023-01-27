package com.opencbs.core.accounting.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountBalanceDto {
    private AccountDto account;
    private BigDecimal balance;
}
