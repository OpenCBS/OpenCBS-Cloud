package com.opencbs.loans.mappers;

import com.opencbs.core.mappers.BaseMapper;
import com.opencbs.loans.domain.ImportPaymentHistory;
import com.opencbs.loans.dto.impotrpaymenthistory.ImportPaymentHistoryDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface ImportPaymentHistoryMapper extends BaseMapper<ImportPaymentHistory, ImportPaymentHistoryDto> {
}
