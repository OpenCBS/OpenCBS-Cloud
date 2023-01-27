package com.opencbs.core.accounting.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountExtendedTag;
import com.opencbs.core.accounting.domain.AccountTag;
import com.opencbs.core.accounting.domain.AccountTagType;
import com.opencbs.core.accounting.repositories.AccountExtendedTagRepository;
import com.opencbs.core.accounting.repositories.AccountTagRepository;
import com.opencbs.core.domain.enums.AccountType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class AccountTagService {

    private final AccountTagRepository accountTagRepository;
    private final AccountExtendedTagRepository accountExtendedTagRepository;

    public AccountTagService(AccountTagRepository accountTagRepository,
                             AccountExtendedTagRepository accountExtendedTagRepository) {
        this.accountTagRepository = accountTagRepository;
        this.accountExtendedTagRepository = accountExtendedTagRepository;
    }

    public AccountTag findOne(Long accountTagId) {
        return this.accountTagRepository.findOne(accountTagId);
    }

    public List<AccountTag> getAll() {
        return this.accountTagRepository.findAll();
    }

    public List<AccountExtendedTag> getAllByAccountId(Long accountId) {
        return this.accountExtendedTagRepository.findAllByAccountId(accountId);
    }

    public List<AccountExtendedTag> getAllByAccountTagId(Long accountTagId) {
        return this.accountExtendedTagRepository.findAllByAccountTagId(accountTagId);
    }

    public AccountTag saveAccountTag(AccountTag accountTag) {
        return this.accountTagRepository.save(accountTag);
    }

    public AccountExtendedTag saveAccountExtendedTag(AccountExtendedTag accountExtendedTag) {
        return this.accountExtendedTagRepository.save(accountExtendedTag);
    }

    public List<AccountExtendedTag> getAllByAccountTagIdAndType(Long accountTagId, AccountType accountType) {
        return this.accountExtendedTagRepository.findAllByAccountTagIdAndAccountType(accountTagId, accountType);
    }

    public List<AccountTagType> getAccountTags() {
        return Arrays.asList(AccountTagType.values());
    }

    public Page<Account> getAccountsByTags(List<AccountTagType> tags, Pageable pageable) {
        List<AccountTag> accountTags = this.accountTagRepository.findAllByNameIn(tags);
        return this.accountExtendedTagRepository.findAllByAccountTagInAndAccountType(accountTags, AccountType.BALANCE, pageable)
                .map(accountExtendedTag -> accountExtendedTag.getAccount()) ;
    }
}
