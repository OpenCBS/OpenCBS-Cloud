package com.opencbs.loans.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.repositories.customs.LoanInstallmentRepositoryCustom;

import java.util.Collection;
import java.util.List;

public interface LoanInstallmentRepository extends Repository<LoanInstallment>, LoanInstallmentRepositoryCustom {

    List<LoanInstallment> findByLoanIdAndEventGroupKeyInAndDeletedFalse(Long loanId, Collection<Long> EventGroupKey);
}
