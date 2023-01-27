package com.opencbs.loans.repositories;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.enums.AccountRuleType;
import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.LoanAccount;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LoanAccountRepository extends Repository<LoanAccount> {

    List<LoanAccount> getAllByLoanId(Long loanId);

    @Query("select la.account from LoanAccount la where la.loanId = ?1 and la.accountRuleType = ?2")
    Optional<Account> getLoanAccount(Long loanId, AccountRuleType loanRuleType);
}