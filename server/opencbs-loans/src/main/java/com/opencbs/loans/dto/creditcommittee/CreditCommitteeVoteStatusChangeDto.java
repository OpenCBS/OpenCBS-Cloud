package com.opencbs.loans.dto.creditcommittee;

import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import lombok.Data;

@Data
public class CreditCommitteeVoteStatusChangeDto {

    private Long creditCommitteeVoteId;

    private LoanApplicationStatus status;

    private String notes;
}
