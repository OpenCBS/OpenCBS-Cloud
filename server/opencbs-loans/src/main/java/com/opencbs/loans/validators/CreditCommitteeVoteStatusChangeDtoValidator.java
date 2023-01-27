package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeVoteStatusChangeDto;
import org.springframework.util.Assert;

@Validator
public class CreditCommitteeVoteStatusChangeDtoValidator {
    public void validate(CreditCommitteeVoteStatusChangeDto creditCommitteeVoteStatusChangeDto) {
        Assert.isTrue(creditCommitteeVoteStatusChangeDto.getCreditCommitteeVoteId() != null,
                "Credit committee vote id shouldn't be empty.");
        Assert.isTrue(creditCommitteeVoteStatusChangeDto.getStatus() != null,
                "Status shouldn't be empty.");
        if (creditCommitteeVoteStatusChangeDto.getNotes() != null) {
            Assert.isTrue(creditCommitteeVoteStatusChangeDto.getNotes().length() < 255,
                    "Number of characters should be less than 255.");
        }
    }
}
