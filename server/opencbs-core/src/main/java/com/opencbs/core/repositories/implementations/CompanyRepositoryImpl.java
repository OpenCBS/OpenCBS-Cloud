package com.opencbs.core.repositories.implementations;

import com.opencbs.core.domain.profiles.Company;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityManager;

public class CompanyRepositoryImpl extends ProfileBaseRepositoryImpl<Company> {
    @Autowired
    public CompanyRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Company.class);
    }
}
