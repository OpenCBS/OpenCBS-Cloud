package com.opencbs.loans.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.ImportPaymentHistory;

import java.time.LocalDateTime;
import java.util.List;

public interface ImportPaymentHistoryRepository extends Repository<ImportPaymentHistory> {
    List<ImportPaymentHistory> findAllByIdIn(List<Long> ids);
    List<ImportPaymentHistory>  findAllByPaymentDateBetween(LocalDateTime fromDate, LocalDateTime toDate);

}
