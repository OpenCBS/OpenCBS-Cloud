package com.opencbs.core.analytics.accounting;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;

import javax.persistence.PrePersist;

public class AccountingEntryListener {

    @PrePersist
    public void prePersist(AccountingEntry accountingEntry) {
        AccountingEntryService accountingEntryService = BeanUtil.getBean(AccountingEntryService.class);
        accountingEntryService.validateAccountingEntry(accountingEntry);
    }
}
