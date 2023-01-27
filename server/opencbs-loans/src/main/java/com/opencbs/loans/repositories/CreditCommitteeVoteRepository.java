package com.opencbs.loans.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeVote;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;

import java.util.Optional;

public interface CreditCommitteeVoteRepository extends Repository<CreditCommitteeVote> {
    Optional<CreditCommitteeVote> findByLoanApplicationIdAndStatus(Long id, LoanApplicationStatus status);
}
