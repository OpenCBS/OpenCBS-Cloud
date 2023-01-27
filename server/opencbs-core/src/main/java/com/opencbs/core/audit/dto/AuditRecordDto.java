package com.opencbs.core.audit.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuditRecordDto {

    private LocalDateTime dateTime;

    private String username;
}
