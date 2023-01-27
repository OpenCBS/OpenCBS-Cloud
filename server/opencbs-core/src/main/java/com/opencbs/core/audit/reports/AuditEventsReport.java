package com.opencbs.core.audit.reports;

import com.opencbs.core.audit.AuditEventIdentificator;
import com.opencbs.core.audit.AuditReport;
import com.opencbs.core.audit.AuditReportType;
import com.opencbs.core.audit.dto.AuditRecordDto;
import com.opencbs.core.audit.dto.AuditReportDto;
import com.opencbs.core.audit.interfaces.Auditable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;


@Service
public class AuditEventsReport implements AuditReport {

    private final List<Auditable> auditers;

    @Autowired
    public AuditEventsReport(List<Auditable> auditers) {
        this.auditers = auditers;
    }

    @Override
    public AuditReportType getType() {
        return AuditReportType.EVENTS;
    }

    @Override
    public Page getRecords(AuditReportDto filter, Pageable pageable) {
        List<AuditEventIdentificator> eventIds = new ArrayList<>();
        for (Auditable auditable : auditers) {
            Optional<List<AuditEventIdentificator>> auditEventDtos = auditable.getAuditEventIds(filter);
            if (auditEventDtos.isPresent()) {
                eventIds.addAll(auditEventDtos.get());
            }
        }
        eventIds.sort(Comparator.comparing(AuditEventIdentificator::getEffectiveAt).reversed());
        if (eventIds.isEmpty()) {
            return new PageImpl(Collections.EMPTY_LIST, pageable, eventIds.size());
        }

        int fromPosition = (eventIds.size() < pageable.getOffset()) ? eventIds.size() : pageable.getOffset();
        int toPosition = (eventIds.size() > pageable.getOffset() + pageable.getPageSize()) ? pageable.getOffset() + pageable.getPageSize() : eventIds.size();
        List<AuditEventIdentificator> auditEventIdentificators = eventIds.subList(fromPosition, toPosition);

        return new PageImpl(getRecordsByIds(auditEventIdentificators), pageable, eventIds.size());
    }

    private List getRecordsByIds(List<AuditEventIdentificator> auditEventIdentificators) {
        List records = new ArrayList<AuditRecordDto>();
        for (AuditEventIdentificator identificator : auditEventIdentificators) {
            records.add(identificator.getAuditor().getAuditEventDtos(identificator));
        }
        return records;
    }

}
