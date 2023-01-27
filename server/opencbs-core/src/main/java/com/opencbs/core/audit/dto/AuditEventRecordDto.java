package com.opencbs.core.audit.dto;

import com.opencbs.core.domain.enums.ContractType;
import lombok.Data;

import java.math.BigDecimal;


@Data
public class AuditEventRecordDto extends AuditRecordDto {

    private String code;

    private String action;

    private BigDecimal amount;

    private String description;

    private ContractType contractType;
}
