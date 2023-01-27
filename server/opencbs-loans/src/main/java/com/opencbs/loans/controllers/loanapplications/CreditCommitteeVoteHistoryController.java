package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeVote;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeVoteHistoryDto;
import com.opencbs.loans.mappers.CreditCommitteeVoteHistoryMapper;
import com.opencbs.loans.services.LoanApplicationService;
import com.opencbs.loans.services.creditcommitteeservices.CreditCommitteeVoteHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/loan-applications/{loanApplicationId}/credit-committee-vote-history")
@SuppressWarnings("/unused/")
public class CreditCommitteeVoteHistoryController {

    private final CreditCommitteeVoteHistoryService creditCommitteeVoteHistoryService;
    private final CreditCommitteeVoteHistoryMapper creditCommitteeVoteHistoryMapper;
    private final LoanApplicationService loanApplicationService;

    @Autowired
    public CreditCommitteeVoteHistoryController(CreditCommitteeVoteHistoryService creditCommitteeVoteHistoryService,
                                                CreditCommitteeVoteHistoryMapper creditCommitteeVoteHistoryMapper,
                                                LoanApplicationService loanApplicationService) {
        this.creditCommitteeVoteHistoryMapper = creditCommitteeVoteHistoryMapper;
        this.creditCommitteeVoteHistoryService = creditCommitteeVoteHistoryService;
        this.loanApplicationService = loanApplicationService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<CreditCommitteeVoteHistoryDto> getAll(@PathVariable long loanApplicationId) {

        LoanApplication loanApplication = this.loanApplicationService
                .findOne(loanApplicationId)
                .orElseThrow(() -> new ResourceAccessException(String.format("Loan application not found (ID=%d).", loanApplicationId)));

        List<CreditCommitteeVoteHistoryDto> list = this.creditCommitteeVoteHistoryService.findAll(loanApplication)
                .stream()
                .map(this.creditCommitteeVoteHistoryMapper::mapToDto)
                .collect(Collectors.toList());
        list.sort(Comparator.comparing(CreditCommitteeVoteHistoryDto::getCreatedAt));
        Collections.reverse(list);
        return list;
    }

    @RequestMapping(path = "/id", method = RequestMethod.GET)
    public Long getCreditCommitteeVoteId(@PathVariable long loanApplicationId) {
        Optional<CreditCommitteeVote> creditCommitteeVote =
                this.creditCommitteeVoteHistoryService.findByLoanApplicationIdAndStatus(loanApplicationId, LoanApplicationStatus.PENDING);
        return creditCommitteeVote.map(CreditCommitteeVote::getId).orElse(null);
    }
}
