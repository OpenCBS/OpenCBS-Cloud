package com.opencbs.core.accounting.repositories.customs;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.dto.SortedAccountingEntryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface AccountingEntryRepositoryCustom {

    Boolean hasTransactions(Long accountId);
    Page<AccountingEntry> getAll(SortedAccountingEntryDto sortedAccountingEntryDto, Pageable pageable);
    Page<AccountingEntry> getAll(SortedAccountingEntryDto sortedAccountingEntryDto, Pageable pageable, List<Long> accounts);
    List<AccountingEntry> getAccountingEntries(LocalDateTime startDate, LocalDateTime endDate);
    List<AccountingEntry> getAccountingEntriesByAccount(Account account, LocalDateTime from, LocalDateTime to);
}
