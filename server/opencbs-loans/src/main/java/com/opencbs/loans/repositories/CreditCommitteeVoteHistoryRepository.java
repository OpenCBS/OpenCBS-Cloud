package com.opencbs.loans.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeVoteHistory;

import java.util.List;

public interface CreditCommitteeVoteHistoryRepository extends Repository<CreditCommitteeVoteHistory> {
    List<CreditCommitteeVoteHistory> findByLoanApplicationOrderByCreatedAt(LoanApplication loanApplication);
}
