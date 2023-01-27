package com.opencbs.core.audit.reports;

import com.opencbs.core.audit.AuditReport;
import com.opencbs.core.audit.AuditReportType;
import com.opencbs.core.audit.dto.AuditReportDto;
import com.opencbs.core.audit.mappers.UserSessionMapper;
import com.opencbs.core.services.UserSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
public class AuditUserSessionsReport implements AuditReport {

    private final UserSessionService userSessionService;

    private final UserSessionMapper userSessionMapper;


    @Autowired
    public AuditUserSessionsReport(UserSessionService userSessionService,
                                   UserSessionMapper userSessionMapper) {
        this.userSessionService = userSessionService;
        this.userSessionMapper = userSessionMapper;
    }

    @Override
    public AuditReportType getType() {
        return AuditReportType.USER_SESSIONS;
    }

    @Override
    public Page getRecords(AuditReportDto filter, Pageable pageable) {
        return userSessionService.getAllByDatesAndUser(filter, pageable)
                .map(source -> userSessionMapper.mapToAuditDto(source));
    }
}
