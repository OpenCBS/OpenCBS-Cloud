package com.opencbs.core.audit.mappers;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.audit.dto.AuditTransactionDto;
import org.modelmapper.ModelMapper;

@Mapper
public class TransactionMapper {

    public AuditTransactionDto mapToTransactionDto(AccountingEntry accountingEntry) {
        ModelMapper mapper = new ModelMapper();
        AuditTransactionDto dto = mapper.map(accountingEntry, AuditTransactionDto.class);
        return dto;
    }
}