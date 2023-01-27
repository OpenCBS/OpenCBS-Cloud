package com.opencbs.loans.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.Guarantor;
import com.opencbs.loans.domain.LoanApplication;

import java.util.List;

public interface GuarantorRepository extends Repository<Guarantor> {
    List<Guarantor> findGuarantorByLoanApplication(LoanApplication loanApplication);
}
