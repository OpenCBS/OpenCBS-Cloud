package com.opencbs.core.accounting.repositories;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.repositories.customs.AccountingEntryRepositoryCustom;
import com.opencbs.core.repositories.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface AccountingEntryRepository extends Repository<AccountingEntry>, AccountingEntryRepositoryCustom {

    Page<AccountingEntry> findAllByDeletedIsFalse(Pageable pageable);

    Optional<AccountingEntry> findTopByDeletedFalseOrderByEffectiveAtDesc();

    Optional<AccountingEntry> findTopByDeletedFalseOrderByEffectiveAtAsc();

    Optional<AccountingEntry> findByIdAndDeletedFalse(Long id);
}
