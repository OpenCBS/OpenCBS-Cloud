package com.opencbs.core.repositories.implementations;

import com.opencbs.core.domain.trees.TreeEntity;
import com.opencbs.core.repositories.customs.TreeEntityRepositoryCustom;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Subqueries;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;

@SuppressWarnings("unused")
public abstract class TreeEntityRepositoryImpl<Tte extends TreeEntity> extends BaseRepository implements TreeEntityRepositoryCustom {

    protected TreeEntityRepositoryImpl(EntityManager entityManager, Class<Tte> tClass) {
        super(entityManager, tClass);
    }

    @Override
    public Page<Tte> findBy(String query, Pageable pageable) {
        Criteria criteria = this.getCriteria();
        Criterion queryCriterion = this.getValueRestriction(query);
        criteria.add(queryCriterion);
        criteria.add(this.getLeavesSubQuery());
        criteria.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        criteria.setMaxResults(pageable.getPageSize());
        criteria.addOrder(Order.asc("t.name"));
        return new PageImpl<>(criteria.list(), pageable, this.getTotal(queryCriterion));
    }

    @Override
    public Page<Tte> findLeaves(Pageable pageable) {
        Criteria criteria = this.getCriteria();
        criteria.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        criteria.setMaxResults(pageable.getPageSize());
        criteria.addOrder(Order.asc("t.name"));
        return new PageImpl<>(criteria.list(), pageable, this.getTotal(null));
    }

    private Criteria getCriteria() {
        Criteria criteria = this.createCriteria("t");
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
        return criteria;
    }

    private Criterion getValueRestriction(String query) {
        return Restrictions
                .like("t.name", query, MatchMode.ANYWHERE)
                .ignoreCase();
    }

    private Long getTotal(Criterion criterion) {
        Criteria criteria = this.getCriteria();
        if (criterion != null) {
            criteria.add(criterion);
        }
        criteria.add(this.getLeavesSubQuery());
        return (long) criteria.setProjection(Projections.rowCount()).uniqueResult();
    }

    private Criterion getLeavesSubQuery() {
        DetachedCriteria detachedCriteria = DetachedCriteria.forClass(this.clazz, "p")
                .add(Restrictions.isNotNull("p.parent.id"))
                .setProjection(Projections.property("p.parent.id"));
        return Subqueries.propertyNotIn("t.id", detachedCriteria);
    }
}
