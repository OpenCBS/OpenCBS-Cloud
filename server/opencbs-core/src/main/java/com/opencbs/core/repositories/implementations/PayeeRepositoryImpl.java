package com.opencbs.core.repositories.implementations;

import com.opencbs.core.domain.Payee;
import com.opencbs.core.repositories.customs.PayeeRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigInteger;

@SuppressWarnings("unused")
public class PayeeRepositoryImpl extends BaseRepository<Payee> implements PayeeRepositoryCustom {

    @Autowired
    public PayeeRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Payee.class);
    }

    @Override
    public Page<Payee> search(Pageable pageable, String searchString) {
        String queryString = "from payees where \"name\" || ' ' || description ilike :searchString";
        Query totalQuery = this.getEntityManager().createNativeQuery("select count(*) " + queryString);
        totalQuery.setParameter("searchString", String.format("%%%s%%", searchString));
        BigInteger total = (BigInteger) totalQuery.getSingleResult();

        Query query = this.getEntityManager().createNativeQuery("select * " + queryString, Payee.class);
        query.setParameter("searchString", String.format("%%%s%%", searchString));
        query.setFirstResult(pageable.getPageSize() * pageable.getPageNumber());
        query.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(query.getResultList(), pageable, total.longValue());
    }
}