package com.opencbs.core.repositories.implementations;

import com.opencbs.core.domain.trees.Profession;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityManager;

@SuppressWarnings("unused")
public class ProfessionRepositoryImpl extends TreeEntityRepositoryImpl<Profession> {

    @Autowired
    protected ProfessionRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Profession.class);
    }
}
