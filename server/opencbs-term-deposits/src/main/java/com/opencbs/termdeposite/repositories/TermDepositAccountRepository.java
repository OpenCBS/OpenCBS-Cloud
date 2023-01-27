package com.opencbs.termdeposite.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.termdeposite.domain.TermDepositAccount;
import com.opencbs.termdeposite.domain.enums.TermDepositAccountType;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TermDepositAccountRepository extends Repository<TermDepositAccount> {

    Optional<TermDepositAccount> findByTermDepositIdAndType(Long termDepositId, TermDepositAccountType type);

    @Query("select tda.id as id from TermDepositAccount tda where tda.termDepositId = ?1 and tda.type = ?2 and tda.accountId = ?3")
    Optional<Long> findByTermDepositAndTypeAndAccount(Long termDepositId, TermDepositAccountType type, Long accountId);
}
