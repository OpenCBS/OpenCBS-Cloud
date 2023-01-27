package com.opencbs.loans.services.creditcommitteeservices;

import com.opencbs.core.domain.Role;
import com.opencbs.core.domain.User;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeAmountRange;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeVote;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeVoteHistory;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeVoteStatusChangeDto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public abstract class BaseCreditCommitteeProcessService {

    private final CreditCommitteeVoteHistoryService committeeVoteHistoryService;
    private final CreditCommitteeAmountRangeService creditCommitteeAmountRangeService;

    public BaseCreditCommitteeProcessService(CreditCommitteeVoteHistoryService committeeVoteHistoryService,
                                             CreditCommitteeAmountRangeService creditCommitteeAmountRangeService) {
        this.committeeVoteHistoryService = committeeVoteHistoryService;
        this.creditCommitteeAmountRangeService = creditCommitteeAmountRangeService;
    }

    public LoanApplication submit(LoanApplication loanApplication) {
        loanApplication.setStatus(LoanApplicationStatus.PENDING);
        if (loanApplication.getCreditCommitteeVotes() == null) {
            loanApplication.setCreditCommitteeVotes(new ArrayList<>());
        }

        loanApplication.getCreditCommitteeVotes().clear();
        CreditCommitteeAmountRange creditCommitteeAmountRange =
                this.getCreditCommitteeAmountRange(loanApplication.getAmount());

        if (creditCommitteeAmountRange == null) {
            throw new IllegalStateException("Loan application amount doesn't fit to any credit committee range.");
        }

        loanApplication.getCreditCommitteeVotes()
                .addAll(this.getPendingVotes(creditCommitteeAmountRange, loanApplication));
        return loanApplication;
    }

    public CreditCommitteeAmountRange getCreditCommitteeAmountRange(BigDecimal amount) {
        List<CreditCommitteeAmountRange> creditCommitteeAmountRanges = this.creditCommitteeAmountRangeService.findAll();
        creditCommitteeAmountRanges.sort(Comparator.comparing(CreditCommitteeAmountRange::getAmount));
        for (CreditCommitteeAmountRange creditCommitteeAmountRange : creditCommitteeAmountRanges) {
            int comparedToLoanAmount = creditCommitteeAmountRange.getAmount().compareTo(amount);
            if (comparedToLoanAmount == 0 || comparedToLoanAmount == 1) {
                return creditCommitteeAmountRange;
            }
        }
        return null;
    }

    public void saveHistory(LoanApplication loanApplication,
                            CreditCommitteeVoteStatusChangeDto dto,
                            User currentUser, CreditCommitteeVote ccv,
                            LoanApplicationStatus status) {
        CreditCommitteeVoteHistory creditCommitteeVoteHistory = new CreditCommitteeVoteHistory();
        creditCommitteeVoteHistory.setLoanApplication(loanApplication);
        creditCommitteeVoteHistory.setRole(currentUser.getRole());
        creditCommitteeVoteHistory.setChangedBy(currentUser);
        creditCommitteeVoteHistory.setCreatedAt(DateHelper.getLocalDateTimeNow());
        creditCommitteeVoteHistory.setNotes(dto.getNotes());
        creditCommitteeVoteHistory.setStatus(status);
        creditCommitteeVoteHistory.setOldStatus(ccv.getStatus());
        this.committeeVoteHistoryService.create(creditCommitteeVoteHistory);
    }

    public List<CreditCommitteeVote> getPendingVotes(CreditCommitteeAmountRange creditCommitteeAmountRange,
                                                     LoanApplication loanApplication) {
        List<CreditCommitteeVote> votes = new ArrayList<>();
        for (Role role : creditCommitteeAmountRange.getRoles()) {
            CreditCommitteeVote creditCommitteeVote = new CreditCommitteeVote();
            creditCommitteeVote.setStatus(LoanApplicationStatus.PENDING);
            creditCommitteeVote.setLoanApplication(loanApplication);
            creditCommitteeVote.setRole(role);
            votes.add(creditCommitteeVote);
        }
        return votes;
    }

    public CreditCommitteeVote getCreditCommitteeVote(LoanApplication loanApplication,
                                                      CreditCommitteeVoteStatusChangeDto dto) throws ResourceNotFoundException {
        return loanApplication.getCreditCommitteeVotes()
                .stream()
                .filter(x -> x.getId()
                        .equals(dto.getCreditCommitteeVoteId()))
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                String.format("There is no credit committee vote with id = (%d) in this loan application.",
                                        dto.getCreditCommitteeVoteId())));
    }

    public boolean allMatch(List<CreditCommitteeVote> votes, LoanApplicationStatus status) {
        return votes
                .stream()
                .allMatch(x -> x.getStatus().equals(status));
    }
}
