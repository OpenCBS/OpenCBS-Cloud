package com.opencbs.loans.audit;

import com.opencbs.core.audit.AuditEventIdentificator;
import com.opencbs.core.audit.dto.AuditEventRecordDto;
import com.opencbs.core.audit.dto.AuditReportDto;
import com.opencbs.core.audit.interfaces.Auditable;
import com.opencbs.core.domain.User;
import com.opencbs.core.services.UserService;
import com.opencbs.loans.mappers.LoanEventMapper;
import com.opencbs.loans.services.LoanEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LoanAuditing implements Auditable {

    private final UserService userService;
    private final LoanEventService loanEventService;
    private final LoanEventMapper loanEventMapper;

    @Autowired
    public LoanAuditing(UserService userService,
                        LoanEventService loanEventService,
                        LoanEventMapper loanEventMapper) {
        this.userService = userService;
        this.loanEventService = loanEventService;
        this.loanEventMapper = loanEventMapper;
    }

    @Override
    public Optional<List<AuditEventIdentificator>> getAuditEventIds(AuditReportDto filter) {
        User user = this.userService.findByUsername(filter.getUsername()).orElse(null);
        List<AuditEventIdentificator> identifications =
                this.loanEventService.getIdentificationsByPeriodAndUser(filter.getFromDate(), filter.getToDate(), user)
                        .stream()
                        .map(loanAuditEventIdentification -> (AuditEventIdentificator)loanAuditEventIdentification)
                        .collect(Collectors.toList());

        this.loanEventService.getRollbackEvents(filter.getFromDate(), filter.getToDate(), user)
                .forEach(
                        loanRollBackEvent -> {
                            LoanAuditEventIdentificator loanAuditEventIdentificator = new LoanAuditEventIdentificator(loanRollBackEvent.getGroupKey(), loanRollBackEvent.getRolledBackTime());
                            loanAuditEventIdentificator.setRollback(true);
                            identifications.add(loanAuditEventIdentificator);
                        }
                );

        identifications.forEach(auditEventIdentification -> auditEventIdentification.setAuditor(this));

        return Optional.of(identifications);
    }

    @Override
    public AuditEventRecordDto getAuditEventDtos(AuditEventIdentificator auditEventIdentificator) {
        LoanAuditEventIdentificator loanAuditEventIdentificator = (LoanAuditEventIdentificator) auditEventIdentificator;
        if (loanAuditEventIdentificator.getRollback()){
            return this.loanEventMapper.rollbackEventsToAuditEventRecord(this.loanEventService.findAllByGroupKey(loanAuditEventIdentificator.getLoanEventId()));
        }
        return this.loanEventMapper.mapToAuditEventRecord(this.loanEventService.findById(loanAuditEventIdentificator.getLoanEventId()).get());
    }
}
