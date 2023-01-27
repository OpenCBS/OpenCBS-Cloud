package com.opencbs.core.audit.controllers;

import com.opencbs.core.audit.AuditReportType;
import com.opencbs.core.audit.dto.AuditReportDto;
import com.opencbs.core.audit.services.AuditTrailService;
import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.security.permissions.PermissionRequired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/audit-trail")
@SuppressWarnings("unused")
public class AuditTrailController extends BaseController {

    private final AuditTrailService auditTrailService;


    @Autowired
    public AuditTrailController(AuditTrailService auditTrailService) {
        this.auditTrailService = auditTrailService;
    }

    @PermissionRequired(name = "AUDIT_TRAIL_BUSINESS_OBJECTS", moduleType = ModuleType.AUDIT_TRAIL, description = "")
    @GetMapping("/report/BUSINESS_OBJECT")
    public Page getBissnessObjectRecords(AuditReportDto filter, Pageable pageable) throws Throwable {
        return auditTrailService.getDates(AuditReportType.BUSINESS_OBJECT, filter, pageable);
    }

    @PermissionRequired(name = "AUDIT_TRAIL_EVENTS", moduleType = ModuleType.AUDIT_TRAIL, description = "")
    @GetMapping("/report/EVENTS")
    public Page getAuditEventsRecords(AuditReportDto filter, Pageable pageable) throws Throwable {
        return auditTrailService.getDates(AuditReportType.EVENTS, filter, pageable);
    }

    @PermissionRequired(name = "AUDIT_TRAIL_TRANSACTIONS", moduleType = ModuleType.AUDIT_TRAIL, description = "")
    @GetMapping("/report/TRANSACTIONS")
    public Page getAuditTransactionRecords(AuditReportDto filter, Pageable pageable) throws Throwable {
        return auditTrailService.getDates(AuditReportType.TRANSACTIONS, filter, pageable);
    }

    @PermissionRequired(name = "AUDIT_TRAIL_USER_SESSIONS", moduleType = ModuleType.AUDIT_TRAIL, description = "")
    @GetMapping("/report/USER_SESSIONS")
    public Page getAuditUserSessionRecords(AuditReportDto filter, Pageable pageable) throws Throwable {
        return auditTrailService.getDates(AuditReportType.USER_SESSIONS, filter, pageable);
    }
}
