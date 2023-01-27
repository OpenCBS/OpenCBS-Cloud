package com.opencbs.core.repositories.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;

@Repository
public class EventGroupKeyRepository extends BaseEventGroupKeyRepository {

    @Autowired
    public EventGroupKeyRepository(EntityManager entityManager) {
        super(entityManager, "events_group_key_seq");
    }
}
