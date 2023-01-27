package com.opencbs.savings.repositories;

import com.opencbs.savings.domain.SavingAccountSimple;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SavingAccountRepository extends JpaRepository<SavingAccountSimple, Long> {

    Optional<SavingAccountSimple> findBySavingIdAndType(Long savingId, SavingAccountRuleType type);

    @Query("select sa.id as id from SavingAccountSimple sa where sa.savingId = ?1 and sa.type = ?2 and sa.accountId = ?3")
    Optional<Long> findBySavingAndTypeAndAccount(Long savingId, SavingAccountRuleType type, Long accountId);
}
