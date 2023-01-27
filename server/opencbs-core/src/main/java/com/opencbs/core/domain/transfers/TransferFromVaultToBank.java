package com.opencbs.core.domain.transfers;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransferFromVaultToBank {
    private Long vaultId;
    private Long currencyId;
    private Long bankAccountId;
    private BigDecimal amount;
    private Long personInCharge;
    private String description;
    private LocalDate date;
}
