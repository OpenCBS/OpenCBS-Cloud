package com.opencbs.core.accounting.repositories;

import com.opencbs.core.accounting.domain.AccountingEntryTill;
import com.opencbs.core.domain.enums.TillOperation;
import com.opencbs.core.domain.till.Till;
import com.opencbs.core.repositories.Repository;

import java.time.LocalDateTime;
import java.util.List;

public interface AccountingEntryTillsRepository extends Repository<AccountingEntryTill> {

    AccountingEntryTill findFirstByOperationTypeOrderByIdDesc(TillOperation tillOperation);
    List<AccountingEntryTill> findAllByTillAndAccountingEntries_EffectiveAtGreaterThanEqualAndAccountingEntries_EffectiveAtLessThanEqual(Till till, LocalDateTime startDate, LocalDateTime endDate);
}
