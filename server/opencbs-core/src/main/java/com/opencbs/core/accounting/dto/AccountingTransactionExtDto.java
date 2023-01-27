package com.opencbs.core.accounting.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AccountingTransactionExtDto extends AccountingTransactionDto {
    private Long debitAccountId;
    private Long creditAccountId;
    private LocalDateTime createdAt;
    private LocalDateTime effectiveAt;
}
