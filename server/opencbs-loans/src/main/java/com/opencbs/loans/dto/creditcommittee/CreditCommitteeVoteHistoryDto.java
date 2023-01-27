package com.opencbs.loans.dto.creditcommittee;

import lombok.Data;

@Data
public class CreditCommitteeVoteHistoryDto extends CreditCommitteeVoteDto {
    private String oldStatus;
}
