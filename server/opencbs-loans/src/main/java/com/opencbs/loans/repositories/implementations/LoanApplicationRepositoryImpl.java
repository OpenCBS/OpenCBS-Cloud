package com.opencbs.loans.repositories.implementations;

import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.repositories.implementations.BaseRepository;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.SimplifiedLoanApplication;
import com.opencbs.loans.domain.customfields.CollateralCustomFieldValue;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomFieldValue;
import com.opencbs.loans.repositories.customs.LoanApplicationRepositoryCustom;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Subqueries;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigDecimal;
import java.util.List;

@Repository
public class LoanApplicationRepositoryImpl extends BaseRepository<LoanApplication> implements LoanApplicationRepositoryCustom {

    @Autowired
    public LoanApplicationRepositoryImpl(EntityManager entityManager) {
        super(entityManager, LoanApplication.class);
    }

    @Override
    public Page<LoanApplication> findByProfile(Pageable pageable, Profile profile) {
        String sql = "select la from LoanApplication la " +
                "where la.profile.id = :profileId or la.id in " +
                "(select gla.loanApplication.id from GroupLoanApplication gla where gla.member.id = :profileId)";

        Query query = this.getEntityManager().createQuery(sql);
        query.setParameter("profileId", profile.getId());

        List<LoanApplication> loanApplications = query.getResultList();
        return new PageImpl<>(loanApplications, pageable, loanApplications.size());
    }

    @Override
    public Page<SimplifiedLoanApplication> findAllSimplifiedLoanApplication(String searchString, Pageable pageable, String order, Boolean isAsc) {
        Criteria criteria = this.createCriteria(LoanApplication.class, "la");
        criteria.createAlias("la.createdBy", "u");
        criteria.createAlias("la.loanProduct", "lp");
        criteria.createAlias("la.profile", "pr");
        criteria.createAlias("la.branch", "br");

        if (!StringUtils.isEmpty(searchString)) {
            DetachedCriteria subQuery = DetachedCriteria.forClass(LoanApplicationCustomFieldValue.class, "lacfv");
            subQuery.add(Restrictions.ilike("value", searchString, MatchMode.ANYWHERE))
                    .add(Restrictions.eq("status", EntityStatus.LIVE));
            subQuery.setProjection(Projections.property("lacfv.owner.id"));

            DetachedCriteria subQueryCollaterals = DetachedCriteria.forClass(CollateralCustomFieldValue.class, "ccfv");
            subQueryCollaterals.createAlias("ccfv.collateral", "c");
            subQueryCollaterals.createAlias("c.typeOfCollateral", "toc");

            BigDecimal amountSearchPattern = null;
            try {
                amountSearchPattern = new BigDecimal(searchString);
            } catch (NumberFormatException exc) {
            }

            subQueryCollaterals.add(
                    Restrictions.disjunction(
                            Restrictions.and(Restrictions.ilike("ccfv.value", searchString, MatchMode.ANYWHERE)),
                            Restrictions.eq("status", EntityStatus.LIVE))
                            .add(Restrictions.ilike("c.name", searchString, MatchMode.ANYWHERE))
                            .add(Restrictions.eq("c.amount", amountSearchPattern))
                            .add(Restrictions.ilike("toc.caption", searchString, MatchMode.ANYWHERE))
            );
            subQueryCollaterals.setProjection(Projections.property("c.loanApplication.id"));

            Criterion where = Restrictions.and(
                    Restrictions.disjunction(Restrictions.ilike("pr.name", searchString, MatchMode.ANYWHERE))
                            .add(Restrictions.ilike("la.code", searchString, MatchMode.ANYWHERE))
                            .add(Restrictions.ilike("br.name", searchString, MatchMode.ANYWHERE))
                            .add(Subqueries.propertyIn("la.id", subQuery))
                            .add(Subqueries.propertyIn("la.id", subQueryCollaterals))
            );
            criteria.add(where);
        }
        criteria.setProjection(Projections.rowCount());

        Long total = (Long) criteria.uniqueResult();

        criteria.setProjection(buildProjectionList());
        Order sortOrder = isAsc ? Order.asc(order) : Order.desc(order);
        criteria.addOrder(sortOrder);

        criteria.setMaxResults(pageable.getPageSize());
        criteria.setFirstResult(pageable.getPageSize() * pageable.getPageNumber());

        return new PageImpl<>(criteria.setResultTransformer(Transformers.aliasToBean(SimplifiedLoanApplication.class)).list(), pageable, total);
    }

    private Projection buildProjectionList() {
        return Projections.projectionList()
                .add(Projections.property("la.id").as("id"))
                .add(Projections.property("la.status").as("status"))
                .add(Projections.property("pr.name").as("profileName"))
                .add(Projections.property("pr.type").as("profileType"))
                .add(Projections.property("la.amount").as("amount"))
                .add(Projections.property("lp.name").as("loanProductName"))
                .add(Projections.property("la.interestRate").as("interestRate"))
                .add(Projections.property("la.createdAt").as("createdAt"))
                .add(Projections.property("la.code").as("code"))
                .add(Projections.property("la.branch").as("branch"))
                .add(Projections.property("la.id").as("id")
                );
    }
}
