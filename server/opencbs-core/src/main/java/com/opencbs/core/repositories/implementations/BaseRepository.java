package com.opencbs.core.repositories.implementations;

import com.opencbs.core.domain.BaseEntity;
import org.hibernate.Criteria;
import org.hibernate.Session;

import javax.persistence.EntityManager;

public abstract class BaseRepository<Tentity extends BaseEntity> {

    private EntityManager entityManager;
    protected Class<Tentity> clazz;

    public BaseRepository(EntityManager entityManager, Class<Tentity> clazz) {
        this.entityManager = entityManager;
        this.clazz = clazz;
    }

    protected Criteria createCriteria(String alias) {
        return getSession().createCriteria(clazz, alias);
    }

    protected Criteria createCriteria(Class clazz, String alias) {
        return getSession().createCriteria(clazz, alias);
    }

    protected EntityManager getEntityManager() {
        return this.entityManager;
    }

    private Session getSession() {
        return entityManager.unwrap(Session.class);
    }
}
