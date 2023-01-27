package com.opencbs.savings.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.savings.domain.SavingAccountingEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SavingAccountingEntryRepository extends Repository<SavingAccountingEntry> {

    List<SavingAccountingEntry> findAllBySavingId(Long savingId);
    Page<SavingAccountingEntry> findBySavingIdOrderByAccountingEntryId(Long savingId, Pageable pageable);
}
