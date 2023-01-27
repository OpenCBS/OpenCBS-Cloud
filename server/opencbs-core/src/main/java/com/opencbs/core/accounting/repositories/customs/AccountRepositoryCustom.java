package com.opencbs.core.accounting.repositories.customs;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.dto.requests.AccountRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AccountRepositoryCustom {

    List<Account> findRootAccounts();

    List<Account> findLeavesByParent(Pageable pageable, Account account);

    List<Account> findLeavesByParentAndBranch(Pageable pageable, Account account, Branch branch);

    Page<Account> search(Long currencyId, String query, List<AccountType> accountTypes, AccountRequest.TypeOfAccount typeOfAccount, Pageable pageable);

    Page<Account> searchCurrentAccounts(long accountTagId, String query, AccountType accountType, Pageable pageable);

    List<Long> findAllAccountIdByParentId(Long parentId);

    AccountType getAccountTypeByAccountId(Long id);
}