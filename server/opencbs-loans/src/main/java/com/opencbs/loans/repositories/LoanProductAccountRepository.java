package com.opencbs.loans.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.products.LoanProductAccount;

import java.util.List;

public interface LoanProductAccountRepository extends Repository<LoanProductAccount> {
    List<LoanProductAccount> getAllByLoanProductId(Long loanProductId);
}