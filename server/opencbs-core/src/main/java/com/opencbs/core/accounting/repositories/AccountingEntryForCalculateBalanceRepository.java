package com.opencbs.core.accounting.repositories;

import com.opencbs.core.accounting.domain.AccountingEntryForCalculateBalance;
import com.opencbs.core.repositories.Repository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface AccountingEntryForCalculateBalanceRepository extends Repository<AccountingEntryForCalculateBalance> {

    @Query(value = "select aefcb from AccountingEntryForCalculateBalance aefcb where effectiveAt between ?1 and ?2 and amount<>0")
    List<AccountingEntryForCalculateBalance> findAllByEffectiveAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}