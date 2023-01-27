package com.opencbs.core.repositories.implementations;

import com.opencbs.core.domain.trees.PaymentMethod;
import com.opencbs.core.repositories.customs.PaymentMethodRepositoryCustom;
import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import java.util.List;

@SuppressWarnings("unused")
public class PaymentMethodRepositoryImpl extends TreeEntityRepositoryImpl<PaymentMethod> implements PaymentMethodRepositoryCustom {

    @Autowired
    protected PaymentMethodRepositoryImpl(EntityManager entityManager) {
        super(entityManager, PaymentMethod.class);
    }

    @Override
    public Page<PaymentMethod> search(String query, Pageable pageable) {
        Criteria criteria = createCriteria("payment");
        criteria.add(Restrictions.ilike("payment.name", query, MatchMode.ANYWHERE));

        criteria.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        criteria.setMaxResults(pageable.getPageSize());

        List<PaymentMethod> paymentMethods = criteria.list();

        criteria.setFirstResult(0);
        criteria.setProjection(Projections.rowCount());

        return new PageImpl<>(paymentMethods, pageable, (Long) criteria.uniqueResult());
    }
}
