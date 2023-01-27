package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.audit.dto.AuditEventRecordDto;
import com.opencbs.core.domain.BaseEvent;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ContractType;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.dto.UserInfoDto;
import com.opencbs.core.services.UserService;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.dto.LoanEventDto;
import com.opencbs.loans.services.LoanService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Mapper
@RequiredArgsConstructor
public class LoanEventMapper {
    private final UserService userService;
    private final LoanService loanService;
    private final ModelMapper modelMapper = new ModelMapper();


    public LoanEventDto mapToDto(BaseEvent loanEvent) {
        LoanEventDto dto = this.modelMapper.map(loanEvent, LoanEventDto.class);
        User createdBy = this.userService.findById(loanEvent.getCreatedById()).orElse(null);
        dto.setCreatedBy(this.modelMapper.map(createdBy, UserInfoDto.class));
        dto.setComment(loanEvent.getComment());
        dto.setGroupKey(loanEvent.getGroupKey());
        return dto;
    }

    public AuditEventRecordDto mapToAuditEventRecord(LoanEvent loanEvent) {
        User user = this.userService.findById(loanEvent.getCreatedById()).get();

        AuditEventRecordDto record = new AuditEventRecordDto();
        record.setCode(this.loanService.findOne(loanEvent.getLoanId()).get().getCode());
        record.setDescription(loanEvent.getComment());
        record.setAmount(loanEvent.getAmount());
        record.setUsername(user.getFullName());
        record.setDateTime(loanEvent.getEffectiveAt());
        record.setAction(loanEvent.getEventType().toString());
        record.setContractType(ContractType.LOAN);

        return record;
    }

    public AuditEventRecordDto rollbackEventsToAuditEventRecord(List<LoanEvent> allByGroupKey) {
        AuditEventRecordDto auditEventRecordDto = new AuditEventRecordDto();
        LoanEvent loanEvent = allByGroupKey.stream().sorted(Comparator.comparing(BaseEvent::getRolledBackTime).reversed()).findFirst().get();

        auditEventRecordDto.setCode(this.loanService.findOne(loanEvent.getLoanId()).get().getCode());
        auditEventRecordDto.setAction(EventType.ROLLBACK.toString());
        auditEventRecordDto.setDescription(loanEvent.getComment());
        auditEventRecordDto.setAmount(allByGroupKey.stream()
                .map(LoanEvent::getAmount)
                .reduce(BigDecimal.ZERO, (a1, a2)->a1.add(a2))
        );
        auditEventRecordDto.setUsername(loanEvent.getRolledBackBy().getFullName());
        auditEventRecordDto.setDateTime(loanEvent.getRolledBackTime());
        auditEventRecordDto.setContractType(ContractType.LOAN);

        return auditEventRecordDto;
    }
}