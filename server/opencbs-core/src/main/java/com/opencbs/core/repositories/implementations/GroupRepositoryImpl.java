package com.opencbs.core.repositories.implementations;

import com.opencbs.core.domain.profiles.Group;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityManager;

public class GroupRepositoryImpl extends ProfileBaseRepositoryImpl<Group> {
    @Autowired
    public GroupRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Group.class);
    }
}
