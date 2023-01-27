package com.opencbs.loans.repositories.implementations;

import com.opencbs.core.repositories.implementations.TreeEntityRepositoryImpl;
import com.opencbs.loans.domain.trees.LoanPurpose;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityManager;

@SuppressWarnings("unused")
public class LoanPurposeRepositoryImpl extends TreeEntityRepositoryImpl<LoanPurpose> {
    @Autowired
    protected LoanPurposeRepositoryImpl(EntityManager entityManager) {
        super(entityManager, LoanPurpose.class);
    }
}
