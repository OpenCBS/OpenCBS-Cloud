package com.opencbs.borrowings.repositories.implementations;

import com.opencbs.core.repositories.implementations.BaseEventGroupKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;

@Repository
public class BorrowingGroupKeyRepository extends BaseEventGroupKeyRepository {
    @Autowired
    public BorrowingGroupKeyRepository(EntityManager entityManager) {
        super(entityManager, "borrowing_event_group_key");
    }
}
