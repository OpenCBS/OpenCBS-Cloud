package com.opencbs.core.audit.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AuditTransactionDto extends AuditRecordDto {

    private String debitAccount;

    private String creditAccount;

    private BigDecimal amount;

    private String description;
}
