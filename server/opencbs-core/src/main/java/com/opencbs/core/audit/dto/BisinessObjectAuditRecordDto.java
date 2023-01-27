package com.opencbs.core.audit.dto;

import lombok.Data;

@Data
public class BisinessObjectAuditRecordDto extends AuditRecordDto {

    private String action;

    private String description;

    private String objectId;

    private String objectType;
}
