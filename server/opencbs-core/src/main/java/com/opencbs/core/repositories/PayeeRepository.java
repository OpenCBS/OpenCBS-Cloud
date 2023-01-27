package com.opencbs.core.repositories;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.Payee;
import com.opencbs.core.repositories.customs.PayeeRepositoryCustom;

import java.util.Optional;

public interface PayeeRepository extends Repository<Payee>, PayeeRepositoryCustom {

    Optional<Payee> findByName(String name);
    Optional<Payee> findOneByPayeeAccounts(Account account);

}
