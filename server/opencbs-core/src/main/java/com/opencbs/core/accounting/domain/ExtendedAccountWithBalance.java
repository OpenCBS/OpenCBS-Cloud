package com.opencbs.core.accounting.domain;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ExtendedAccountWithBalance extends ExtendedAccount {
    private BigDecimal balance;
}
