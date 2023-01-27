package com.opencbs.loans.services;

import com.opencbs.core.services.TreeEntityService;
import com.opencbs.loans.domain.trees.LoanPurpose;
import com.opencbs.loans.repositories.LoanPurposeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoanPurposeService extends TreeEntityService<LoanPurposeRepository, LoanPurpose> {
    @Autowired
    public LoanPurposeService(LoanPurposeRepository repository) {
        super(repository);
    }
}
