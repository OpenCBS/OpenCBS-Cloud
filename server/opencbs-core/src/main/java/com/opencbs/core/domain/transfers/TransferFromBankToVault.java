package com.opencbs.core.domain.transfers;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransferFromBankToVault {
    private Long bankAccountId;
    private Long vaultId;
    private BigDecimal amount;
    private String chequeNumber;
    private String chequePayee;
    private Long personInCharge;
    private String description;
    private LocalDate date;
}
