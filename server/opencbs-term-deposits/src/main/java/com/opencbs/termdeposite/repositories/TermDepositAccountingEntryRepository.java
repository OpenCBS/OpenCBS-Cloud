package com.opencbs.termdeposite.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.domain.TermDepositAccountingEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TermDepositAccountingEntryRepository extends Repository<TermDepositAccountingEntry> {

    Page<TermDepositAccountingEntry> findByTermDepositOrderByAccountingEntry_EffectiveAt(TermDeposit termDeposit, Pageable pageable);
}
