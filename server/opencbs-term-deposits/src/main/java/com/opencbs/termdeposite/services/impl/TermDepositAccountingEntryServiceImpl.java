package com.opencbs.termdeposite.services.impl;

import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.domain.TermDepositAccountingEntry;
import com.opencbs.termdeposite.repositories.TermDepositAccountingEntryRepository;
import com.opencbs.termdeposite.services.TermDepositAccountingEntryService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TermDepositAccountingEntryServiceImpl implements TermDepositAccountingEntryService {

    private final TermDepositAccountingEntryRepository termDepositAccountingEntryRepository;


    @Override
    public Page<TermDepositAccountingEntry> getPageableByTermDeposit(@NonNull TermDeposit termDeposit, @NonNull Pageable pageable) {
        return termDepositAccountingEntryRepository.findByTermDepositOrderByAccountingEntry_EffectiveAt(termDeposit, pageable);
    }

    @Override
    public void save(@NonNull TermDepositAccountingEntry entry) {
        termDepositAccountingEntryRepository.save(entry);
    }

}
