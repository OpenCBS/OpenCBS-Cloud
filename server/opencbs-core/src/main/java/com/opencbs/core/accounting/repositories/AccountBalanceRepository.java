package com.opencbs.core.accounting.repositories;

import com.opencbs.core.accounting.domain.AccountBalance;
import com.opencbs.core.accounting.repositories.customs.AccountBalanceRepositoryCustom;
import com.opencbs.core.repositories.Repository;
import org.springframework.data.jpa.repository.Lock;

import javax.persistence.LockModeType;
import java.time.LocalDateTime;
import java.util.Optional;

public interface AccountBalanceRepository extends Repository<AccountBalance>, AccountBalanceRepositoryCustom {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    void deleteAllByDateEqualsOrDateAfter(LocalDateTime equal, LocalDateTime after);

    @Lock(LockModeType.PESSIMISTIC_READ)
    Optional<AccountBalance> findByAccountIdAndDate(Long account, LocalDateTime localDateTime);

    Optional<AccountBalance> findFirstByAccountIdAndDateLessThanEqualOrderByDateDesc(Long accountId, LocalDateTime localDateTime);
}
