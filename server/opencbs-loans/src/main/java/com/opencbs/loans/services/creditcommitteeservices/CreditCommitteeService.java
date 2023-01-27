package com.opencbs.loans.services.creditcommitteeservices;

import com.opencbs.core.domain.User;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.exceptions.UnauthorizedException;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeVoteStatusChangeDto;

public interface CreditCommitteeService {

    LoanApplication submit(LoanApplication loanApplication);
    LoanApplication process(LoanApplication loanApplication, CreditCommitteeVoteStatusChangeDto dto, User currentUser)
            throws UnauthorizedException, ResourceNotFoundException;

}
