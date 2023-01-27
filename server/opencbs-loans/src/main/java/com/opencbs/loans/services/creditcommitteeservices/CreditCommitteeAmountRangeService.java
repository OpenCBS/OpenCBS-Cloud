package com.opencbs.loans.services.creditcommitteeservices;

import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeAmountRange;
import com.opencbs.loans.repositories.CreditCommitteeAmountRangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CreditCommitteeAmountRangeService {

    private final CreditCommitteeAmountRangeRepository creditCommitteeAmountRangeRepository;

    @Autowired
    public CreditCommitteeAmountRangeService(CreditCommitteeAmountRangeRepository creditCommitteeAmountRangeRepository) {
        this.creditCommitteeAmountRangeRepository = creditCommitteeAmountRangeRepository;
    }

    public List<CreditCommitteeAmountRange> findAll() {
        return this.creditCommitteeAmountRangeRepository.findAll();
    }

    public Optional<CreditCommitteeAmountRange> findOne(long id) {
        return Optional.ofNullable(this.creditCommitteeAmountRangeRepository.findOne(id));
    }

    @Transactional
    public CreditCommitteeAmountRange create(CreditCommitteeAmountRange creditCommitteeAmountRange, User currentUser) {
        creditCommitteeAmountRange.setId(null);
        creditCommitteeAmountRange.setCreatedAt(DateHelper.getLocalDateTimeNow());
        creditCommitteeAmountRange.setCreatedBy(currentUser);
        return this.creditCommitteeAmountRangeRepository.save(creditCommitteeAmountRange);
    }

    public CreditCommitteeAmountRange update(CreditCommitteeAmountRange creditCommitteeAmountRange) {
        return this.creditCommitteeAmountRangeRepository.save(creditCommitteeAmountRange);
    }
}
