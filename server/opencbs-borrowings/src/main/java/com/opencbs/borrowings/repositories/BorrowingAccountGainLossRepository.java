package com.opencbs.borrowings.repositories;

import com.opencbs.borrowings.domain.BorrowingAccountGainLoss;
import com.opencbs.borrowings.domain.enums.BorrowingRuleType;
import com.opencbs.core.accounting.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BorrowingAccountGainLossRepository extends JpaRepository<BorrowingAccountGainLoss, Long> {

    @Query("select ba.account from BorrowingAccountGainLoss ba where ba.borrowingId = ?1 and ba.accountRuleType = ?2")
    Optional<Account> getBorrowingAccount(Long borrowingId, BorrowingRuleType borrowingRuleType);
}
