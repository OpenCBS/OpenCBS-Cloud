package com.opencbs.core.accounting.repositories;

import com.opencbs.core.accounting.domain.AccountingEntryLog;
import com.opencbs.core.repositories.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AccountingEntryLogRepository extends Repository<AccountingEntryLog> {
    List<AccountingEntryLog> findAllByHandledFalse();
    Optional<AccountingEntryLog> findFirstByHandledFalse();
    void deleteAllByEffectiveDateBetween(LocalDateTime dateStart, LocalDateTime dateEnd);
}