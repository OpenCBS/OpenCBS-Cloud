package com.opencbs.core.repositories.implementations;

import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;

@Repository
public class PayeeEventGroupKeyRepository extends BaseEventGroupKeyRepository {

    public PayeeEventGroupKeyRepository(EntityManager entityManager) {
        super(entityManager, "payees_event_group_key");
    }
}
