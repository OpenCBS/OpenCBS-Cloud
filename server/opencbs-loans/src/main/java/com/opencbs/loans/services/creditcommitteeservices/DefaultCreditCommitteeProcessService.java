package com.opencbs.loans.services.creditcommitteeservices;

import com.opencbs.core.domain.User;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.exceptions.UnauthorizedException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeVote;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeVoteStatusChangeDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DefaultCreditCommitteeProcessService extends BaseCreditCommitteeProcessService implements CreditCommitteeService {

    public DefaultCreditCommitteeProcessService(CreditCommitteeVoteHistoryService committeeVoteHistoryService,
                                                CreditCommitteeAmountRangeService creditCommitteeAmountRangeService) {
        super(committeeVoteHistoryService, creditCommitteeAmountRangeService);
    }

    @Override
    @Transactional
    public LoanApplication process(LoanApplication loanApplication,
                                   CreditCommitteeVoteStatusChangeDto dto,
                                   User currentUser) throws UnauthorizedException, ResourceNotFoundException {
        CreditCommitteeVote creditCommitteeVote = this.getCreditCommitteeVote(loanApplication, dto);
        if (!currentUser.getRole().getId().equals(creditCommitteeVote.getRole().getId())) {
            throw new UnauthorizedException("You are not authorized to change the status.");
        }

        this.saveHistory(loanApplication, dto, currentUser, creditCommitteeVote, dto.getStatus());
        creditCommitteeVote.setStatus(dto.getStatus());
        creditCommitteeVote.setNotes(dto.getNotes());
        creditCommitteeVote.setCreatedAt(DateHelper.getLocalDateTimeNow());
        creditCommitteeVote.setChangedBy(currentUser);

        if (currentUser.hasPermission(UserHelper.getPrimaryCommitteePermission())) {
            loanApplication.setStatus(dto.getStatus());
            return loanApplication;
        }

        return loanApplication;
    }
}
