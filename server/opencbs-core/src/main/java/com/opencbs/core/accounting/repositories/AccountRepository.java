package com.opencbs.core.accounting.repositories;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.repositories.customs.AccountRepositoryCustom;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.repositories.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.history.RevisionRepository;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends RevisionRepository<Account, Long, Integer>, Repository<Account>, AccountRepositoryCustom {

    Page<Account> findAllByTypeIn(Pageable pageable, List<AccountType> accountTypes);

    Page<Account> findAllByTypeInAndCurrency(Pageable pageable, List<AccountType> accountTypes, Currency currency);

    Page<Account> findAllByTypeInAndCurrencyAndIsDebit(Pageable pageable, List<AccountType> accountTypes, Currency currency, Boolean isDebit);

    @Query(value = "select get_balance(:accountId, :dateTime)", nativeQuery = true)
    BigDecimal getAccountBalance(@Param("accountId") long accountId, @Param("dateTime") LocalDateTime dateTime);

    Optional<Account> findByNumber(String number);

    Optional<Account> findByNumberAndCurrencyAndBranchId(String number, Currency currency, Long branchId);

    Long countByParent(Account account);
}
