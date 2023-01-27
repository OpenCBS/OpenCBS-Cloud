package com.opencbs.loans.domain.creditCommittee;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity(name = "Vote")
@Table(name = "credit_committee_votes")
public class CreditCommitteeVote extends CreditCommitteeVoteHistoryBaseEntity {

}
