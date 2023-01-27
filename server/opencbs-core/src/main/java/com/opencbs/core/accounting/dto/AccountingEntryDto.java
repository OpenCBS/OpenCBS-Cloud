package com.opencbs.core.accounting.dto;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AccountingEntryDto extends BaseDto {

    private BigDecimal amount;
    private String branchName;
    private String description;
    private String documentNumber;
    private String createdByFullName;
    private String creditAccountName;
    private String creditAccountNumber;
    private String debitAccountName;
    private String debitAccountNumber;
    private LocalDateTime createdAt;
    private LocalDateTime effectiveAt;
}
