package com.opencbs.loans.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.LoanPenaltyAccount;

import java.util.List;

public interface LoanPenaltyAccountRepository extends Repository<LoanPenaltyAccount> {

    List<LoanPenaltyAccount> findAllByLoanId(Long loanId);
}