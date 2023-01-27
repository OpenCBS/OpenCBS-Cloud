package com.opencbs.loans.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.schedules.installments.LoanApplicationInstallment;

import java.util.List;

public interface LoanApplicationInstallmentRepository extends Repository<LoanApplicationInstallment> {

    List<LoanApplicationInstallment> findLoanApplicationInstallmentsByLoanApplication_Id(Long loanApplicationId);
}
