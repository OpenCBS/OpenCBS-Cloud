package com.opencbs.core.accounting.repositories;

import com.opencbs.core.accounting.domain.AccountExtendedTag;
import com.opencbs.core.accounting.domain.AccountTag;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.repositories.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collection;
import java.util.List;

public interface AccountExtendedTagRepository extends Repository<AccountExtendedTag> {

    List<AccountExtendedTag> findAllByAccountId(Long accountId);

    List<AccountExtendedTag> findAllByAccountTagId(Long accountTagId);

    List<AccountExtendedTag> findAllByAccountTagIdAndAccountType(Long accountTagId, AccountType accountType);

    Page<AccountExtendedTag> findAllByAccountTagInAndAccountType(Collection<AccountTag> accountTags, AccountType accountType, Pageable pageable);
}
