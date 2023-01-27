package com.opencbs.bonds.repositories.implementations;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.SimplifiedBond;
import com.opencbs.bonds.repositories.custom.BondRepositoryCustom;
import com.opencbs.core.repositories.implementations.BaseRepository;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.sql.JoinType;
import org.hibernate.transform.Transformers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import java.util.List;

@SuppressWarnings("unused")
public class BondRepositoryImpl extends BaseRepository<Bond> implements BondRepositoryCustom {

    public BondRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Bond.class);
    }

    @Override
    public Page<SimplifiedBond> findAllSimplifiedBonds(String searchQuery, Pageable pageable) {
        Criteria criteria = this.getCriteria();
        criteria.createAlias("b.createdBy","u", JoinType.LEFT_OUTER_JOIN);
        criteria.createAlias("b.profile","pr", JoinType.LEFT_OUTER_JOIN);

        if(!StringUtils.isEmpty(searchQuery)){
            Criterion where = Restrictions.or(
                    Restrictions.ilike("pr.name", searchQuery, MatchMode.ANYWHERE),
                    Restrictions.ilike("b.isin", searchQuery, MatchMode.ANYWHERE));
            criteria.add(where);
        }

        criteria.setProjection(Projections.rowCount());
        Long total = (Long) criteria.uniqueResult();

        criteria.setMaxResults(pageable.getPageSize());
        criteria.setFirstResult(pageable.getPageSize() * pageable.getPageNumber());
        criteria.setProjection(this.getSimplifiedBondProjections());
        criteria.setResultTransformer(Transformers.aliasToBean(SimplifiedBond.class));
        List<SimplifiedBond> results = (List<SimplifiedBond>) criteria.list();

        return new PageImpl<>(results, pageable, total);

    }

    private Projection getSimplifiedBondProjections(){
        return Projections.projectionList()
                .add(Projections.property("b.id").as("id"))
                .add(Projections.property("b.isin").as("isin"))
                .add(Projections.property("b.status").as("status"))
                .add(Projections.property("b.interestRate").as("interestRate"))
                .add(Projections.property("b.number").as("number"))
                .add(Projections.property("pr.id").as("profileId"))
                .add(Projections.property("pr.name").as("profileName"))
                .add(Projections.property("b.amount").as("amount"))
                .add(Projections.property("b.createdAt").as("createdAt"))
                .add(Projections.property("u.id").as("createdById"))
                .add(Projections.property("u.firstName").as("createdByFirstName"))
                .add(Projections.property("u.lastName").as("createdByLastName"));
    }

    private Criteria getCriteria(){
        Criteria criteria =  this.createCriteria("b");
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
        return criteria;
    }
}