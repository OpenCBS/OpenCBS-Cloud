package com.opencbs.core.audit.services;

import com.opencbs.core.audit.AuditReport;
import com.opencbs.core.audit.AuditReportType;
import com.opencbs.core.audit.dto.AuditReportDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class AuditTrailService {

    private final List<AuditReport> reports;


    @Autowired
    public AuditTrailService(List<AuditReport> reports) {
        this.reports = reports;
    }

    public Page getDates(AuditReportType reportType, AuditReportDto filter, Pageable pageable) throws Throwable {
        filter.setUsername(null); //remote filter by user
        AuditReport instanceOfType = getInstanceOfType(reportType);
        return instanceOfType.getRecords(filter, pageable);
    }

    private AuditReport getInstanceOfType(AuditReportType auditReportType) {
        for (AuditReport auditReport : reports) {
            if (auditReport.getType().equals(auditReportType)) {
                return auditReport;
            }
        }
        throw new ResourceNotFoundException(String.format("Audit report with type(%s) not found", auditReportType));
    }

}
