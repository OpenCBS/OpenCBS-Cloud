package com.opencbs.bonds.repositories;

import com.opencbs.core.repositories.implementations.BaseEventGroupKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;

@Repository
public class BondEventGroupKeyRepository extends BaseEventGroupKeyRepository {

    @Autowired
    public BondEventGroupKeyRepository(EntityManager entityManager) {
        super(entityManager, "bond_events_group_key");
    }
}
