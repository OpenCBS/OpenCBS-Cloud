package com.opencbs.loans.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeAmountRange;

@org.springframework.stereotype.Repository
public interface CreditCommitteeAmountRangeRepository extends Repository<CreditCommitteeAmountRange> {

    CreditCommitteeAmountRange findTopByOrderByAmountDesc();
}
