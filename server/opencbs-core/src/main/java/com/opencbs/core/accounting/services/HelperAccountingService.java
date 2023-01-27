package com.opencbs.core.accounting.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountExtendedTag;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.analytics.accounting.BeanUtil;
import com.opencbs.core.helpers.DateHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class HelperAccountingService {

    private final AccountingEntryLogService accountingEntryLogService;

    public void  doWorkOverBalance(AccountingEntry accountingEntry) {
        if (!DateHelper.equal(accountingEntry.getEffectiveAt().toLocalDate(), DateHelper.getLocalDateNow())
            || (accountingEntry.getId() != null && accountingEntry.getDeleted())) {
            accountingEntryLogService.saveAccountingEntryLog(accountingEntry);
        }
    }

    @Transactional
    public void saveParentTagsForNewAccount(Account account) {
        if(account.getParent() == null) {
            return;
        }

        AccountTagService accountTagService = BeanUtil.getBean(AccountTagService.class);

        List<AccountExtendedTag> allParentTags = accountTagService.getAllByAccountId(account.getParent().getId());
        for (AccountExtendedTag accountExtendedTag : allParentTags) {
            AccountExtendedTag forSave = new AccountExtendedTag();
            forSave.setAccount(account);
            forSave.setAccountTag(accountExtendedTag.getAccountTag());
            accountTagService.saveAccountExtendedTag(forSave);
        }
    }
}
