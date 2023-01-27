package com.opencbs.termdeposite.repositories.implementations;

import com.opencbs.core.repositories.implementations.BaseRepository;
import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.dto.TermDepositSimplified;
import com.opencbs.termdeposite.repositories.TermDepositRepositoryCustom;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.transform.Transformers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import java.util.List;

public class TermDepositRepositoryImpl extends BaseRepository<TermDeposit> implements TermDepositRepositoryCustom {

    public TermDepositRepositoryImpl(EntityManager entityManager) {
        super(entityManager, TermDeposit.class);
    }

    private Criteria getCriteria() {
        Criteria criteria = this.createCriteria("term");
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
        return criteria;
    }

    @Override
    public Page<TermDepositSimplified> getAllWithSearch(String searchString, Pageable pageable) {
        Criteria criteria = this.getCriteria();
        criteria.createCriteria("profile", "profile");
        criteria.createCriteria("serviceOfficer", "serviceOfficer");
        criteria.createCriteria("termDepositProduct", "termDepositProduct");
        if (!StringUtils.isEmpty(searchString)) {
            Criterion criterion = Restrictions.or(
                    Restrictions.like("term.code", searchString, MatchMode.ANYWHERE).ignoreCase(),
                    Restrictions.like("profile.name", searchString, MatchMode.ANYWHERE).ignoreCase()
            );
            criteria.add(criterion);
        }

        long total = (long) criteria.setProjection(Projections.rowCount()).uniqueResult();

        criteria.setProjection(this.getProjectionList());
        criteria.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        criteria.setMaxResults(pageable.getPageSize());
        criteria.addOrder(Order.desc("createdAt"));
        criteria.setResultTransformer(Transformers.aliasToBean(TermDepositSimplified.class));

        List<TermDepositSimplified> result = criteria.list();
        return new PageImpl<>(result, pageable, total);
    }

    private ProjectionList getProjectionList() {
        ProjectionList projectionList = Projections.projectionList();
        projectionList.add(Projections.property("term.id").as("id"));
        projectionList.add(Projections.property("term.code").as("code"));
        projectionList.add(Projections.property("term.status").as("status"));
        projectionList.add(Projections.property("profile.name").as("profileName"));
        projectionList.add(Projections.property("profile.id").as("profileId"));
        projectionList.add(Projections.property("serviceOfficer.firstName").as("serviceOfficerFirstName"));
        projectionList.add(Projections.property("serviceOfficer.lastName").as("serviceOfficerLastName"));
        projectionList.add(Projections.property("serviceOfficer.id").as("serviceOfficerId"));
        projectionList.add(Projections.property("term.openDate").as("openDate"));
        projectionList.add(Projections.property("termDepositProduct.name").as("productName"));
        projectionList.add(Projections.property("termDepositProduct.id").as("productId"));
        projectionList.add(Projections.property("term.createdAt").as("createdAt"));

        return projectionList;
    }
}
