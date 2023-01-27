package com.opencbs.core.audit.interfaces;

import com.opencbs.core.audit.AuditEventIdentificator;
import com.opencbs.core.audit.dto.AuditEventRecordDto;
import com.opencbs.core.audit.dto.AuditReportDto;

import java.util.List;
import java.util.Optional;


public interface Auditable {

    Optional<List<AuditEventIdentificator>> getAuditEventIds(AuditReportDto filter);

    AuditEventRecordDto getAuditEventDtos(AuditEventIdentificator eventIdentificator);
}
