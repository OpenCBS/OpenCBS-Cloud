package com.opencbs.core.audit;

import com.opencbs.core.audit.dto.AuditReportDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditReport {

    AuditReportType getType();

    Page getRecords(AuditReportDto filter, Pageable pageable) throws Throwable;
}
