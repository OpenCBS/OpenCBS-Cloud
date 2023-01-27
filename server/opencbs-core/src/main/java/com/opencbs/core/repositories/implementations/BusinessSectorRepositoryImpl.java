package com.opencbs.core.repositories.implementations;

import com.opencbs.core.domain.trees.BusinessSector;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityManager;

@SuppressWarnings("unused")
public class BusinessSectorRepositoryImpl extends TreeEntityRepositoryImpl<BusinessSector> {
    @Autowired
    public BusinessSectorRepositoryImpl(EntityManager entityManager) {
        super(entityManager, BusinessSector.class);
    }
}
