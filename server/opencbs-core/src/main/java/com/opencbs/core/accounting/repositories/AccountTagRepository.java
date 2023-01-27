package com.opencbs.core.accounting.repositories;

import com.opencbs.core.accounting.domain.AccountTag;
import com.opencbs.core.accounting.domain.AccountTagType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface AccountTagRepository extends JpaRepository<AccountTag, Long> {

    List<AccountTag> findAllByNameIn(Collection<AccountTagType> accountTagTypes);
}
