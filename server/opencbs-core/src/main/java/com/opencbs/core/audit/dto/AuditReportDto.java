package com.opencbs.core.audit.dto;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class AuditReportDto {

    private String username;

    private @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate fromDate = LocalDate.MIN;

    private @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate toDate = LocalDate.MAX;
}
