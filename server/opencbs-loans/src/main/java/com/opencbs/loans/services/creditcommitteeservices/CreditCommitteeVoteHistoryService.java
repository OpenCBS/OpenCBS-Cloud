package com.opencbs.loans.services.creditcommitteeservices;

import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeVote;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeVoteHistory;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import com.opencbs.loans.repositories.CreditCommitteeVoteHistoryRepository;
import com.opencbs.loans.repositories.CreditCommitteeVoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CreditCommitteeVoteHistoryService {

    private final CreditCommitteeVoteHistoryRepository creditCommitteeVoteHistoryRepository;
    private final CreditCommitteeVoteRepository creditCommitteeVoteRepository;

    @Autowired
    public CreditCommitteeVoteHistoryService(CreditCommitteeVoteHistoryRepository creditCommitteeVoteHistoryRepository,
                                             CreditCommitteeVoteRepository creditCommitteeVoteRepository) {
        this.creditCommitteeVoteHistoryRepository = creditCommitteeVoteHistoryRepository;
        this.creditCommitteeVoteRepository = creditCommitteeVoteRepository;
    }

    public List<CreditCommitteeVoteHistory> findAll(LoanApplication loanApplication) {
        return this.creditCommitteeVoteHistoryRepository.findByLoanApplicationOrderByCreatedAt(loanApplication);
    }

    @Transactional
    public CreditCommitteeVoteHistory create(CreditCommitteeVoteHistory creditCommitteeVoteHistory) {
        creditCommitteeVoteHistory.setId(0L);
        return this.creditCommitteeVoteHistoryRepository.save(creditCommitteeVoteHistory);
    }

    public Optional<CreditCommitteeVote> findByLoanApplicationIdAndStatus(Long id, LoanApplicationStatus status) {
        return this.creditCommitteeVoteRepository.findByLoanApplicationIdAndStatus(id, status);
    }
}
