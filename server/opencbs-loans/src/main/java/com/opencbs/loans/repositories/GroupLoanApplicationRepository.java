package com.opencbs.loans.repositories;

import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.GroupLoanApplication;
import com.opencbs.loans.domain.LoanApplication;

import java.util.List;

public interface GroupLoanApplicationRepository extends Repository<GroupLoanApplication> {

    List<GroupLoanApplication> findAllByLoanApplicationAndDeletedFalse(LoanApplication loanApplication);

    List<GroupLoanApplication> findAllByGroupAndDeletedFalse(Group group);
}
