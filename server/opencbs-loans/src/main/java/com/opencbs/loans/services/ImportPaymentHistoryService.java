package com.opencbs.loans.services;

import com.opencbs.core.domain.profiles.Person;
import com.opencbs.loans.domain.ImportPaymentHistory;
import com.opencbs.loans.dto.impotrpaymenthistory.ImportPaymentHistoryDto;
import com.opencbs.loans.dto.impotrpaymenthistory.RepaymentHistoryFilterDto;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;

public interface ImportPaymentHistoryService {

    List<ImportPaymentHistoryDto> getList(RepaymentHistoryFilterDto filterDto);

    ResponseEntity getImportPaymentHistoryExcel(List<ImportPaymentHistory> entities) throws IOException;

    List<ImportPaymentHistory> findAll();

    List<ImportPaymentHistory> findAllByIds(List<Long> ids);

    Long addPayment(ImportPaymentHistoryDto dto);

    Person getClientInfo(String contract);
}
