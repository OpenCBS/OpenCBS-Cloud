package com.opencbs.loans.domain.creditCommittee;

import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

@Entity(name = "history")
@Data
@Table(name = "credit_committee_votes_history")
public class CreditCommitteeVoteHistory extends CreditCommitteeVoteHistoryBaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status")
    private LoanApplicationStatus oldStatus;
}

