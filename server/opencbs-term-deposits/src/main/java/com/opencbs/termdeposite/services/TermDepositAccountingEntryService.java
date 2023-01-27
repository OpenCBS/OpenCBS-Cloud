package com.opencbs.termdeposite.services;

import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.domain.TermDepositAccountingEntry;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TermDepositAccountingEntryService {

    Page<TermDepositAccountingEntry> getPageableByTermDeposit(@NonNull TermDeposit termDeposit, @NonNull Pageable pageable);

    void save(@NonNull TermDepositAccountingEntry entry);
}
