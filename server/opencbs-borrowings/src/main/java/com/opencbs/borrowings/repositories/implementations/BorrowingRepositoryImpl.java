package com.opencbs.borrowings.repositories.implementations;

import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.repositories.implementations.BaseRepository;
import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.BorrowingEvent;
import com.opencbs.borrowings.domain.SimplifiedBorrowing;
import com.opencbs.borrowings.repositories.custom.BorrowingRepositoryCustom;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Subqueries;
import org.hibernate.sql.JoinType;
import org.hibernate.transform.Transformers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@SuppressWarnings("unused")
public class BorrowingRepositoryImpl extends BaseRepository<Borrowing> implements BorrowingRepositoryCustom {
    public BorrowingRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Borrowing.class);
    }

    @Override
    public List<Borrowing> getActiveBorrowings(LocalDateTime dateTime) {
        Criteria criteria = this.getCriteria();
        criteria.add(this.getClosedCriterion(dateTime));
        criteria.add(this.getActivatedCriterion(dateTime));

        criteria.addOrder(Order.asc("loan.id"));
        return criteria.list();
    }

    @Override
    public List<Borrowing> getAllActiveNotInPivotCurrency(LocalDateTime dateTime, Long currencyId) {
        Criteria criteria = this.getCriteria();
        criteria.createAlias("loan.borrowingProduct", "borrowingProduct", JoinType.LEFT_OUTER_JOIN);
        criteria.createAlias("borrowingProduct.currency", "currency", JoinType.LEFT_OUTER_JOIN);

        criteria.add(this.getClosedCriterion(dateTime));
        criteria.add(this.getActivatedCriterion(dateTime));
        criteria.add(Restrictions.ne("currency.id", currencyId));

        return criteria.list();
    }

    @Override
    public Page<SimplifiedBorrowing> getAll(String searchString, Pageable pageable) {
        Criterion criterion = Restrictions.or(
                Restrictions.like("code", searchString, MatchMode.ANYWHERE).ignoreCase(),
                Restrictions.like("profile.name", searchString, MatchMode.ANYWHERE).ignoreCase()
        );

        Criteria criteria = this.getCriteria();
        criteria.createCriteria("createdBy", "created_by");
        criteria.createCriteria("profile", "profile");
        criteria.createCriteria("borrowingProduct", "borrowingProduct");
        criteria.add(criterion);

        long total = (long) criteria.setProjection(Projections.rowCount()).uniqueResult();
        criteria.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        criteria.setMaxResults(pageable.getPageSize());
        criteria.addOrder(Order.desc("createdAt"));

        criteria.setProjection(this.getProjectionList());
        criteria.setResultTransformer(Transformers.aliasToBean(SimplifiedBorrowing.class));
        List<SimplifiedBorrowing> results = (List<SimplifiedBorrowing>) criteria.list();
        return new PageImpl<>(results, pageable, total);
    }

    private Criteria getCriteria() {
        Criteria criteria = this.createCriteria("loan");
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
        return criteria;
    }

    private Criterion getClosedCriterion(LocalDateTime dateTime) {
        Criterion criterion = Restrictions.and(
                Restrictions.le("closed.effectiveAt", dateTime),
                Restrictions.in("closed.eventType", Arrays.asList(EventType.CLOSED, EventType.WRITE_OFF_OLB)),
                Restrictions.ne("closed.deleted", true));
        DetachedCriteria detachedCriteria = DetachedCriteria.forClass(BorrowingEvent.class, "closed")
                .add(criterion)
                .setProjection(Projections.property("closed.borrowingId"));
        return Subqueries.propertyNotIn("loan.id", detachedCriteria);
    }

    private Criterion getActivatedCriterion(LocalDateTime dateTime) {
        Criterion criterion = Restrictions.and(
                Restrictions.le("activated.effectiveAt", dateTime),
                Restrictions.in("activated.eventType", Arrays.asList(EventType.DISBURSEMENT)),
                Restrictions.ne("activated.deleted", true));
        DetachedCriteria detachedCriteria = DetachedCriteria.forClass(BorrowingEvent.class, "activated")
                .add(criterion)
                .setProjection(Projections.property("activated.borrowingId"));
        return Subqueries.propertyIn("loan.id", detachedCriteria);
    }

    private ProjectionList getProjectionList() {
        ProjectionList projectionList = Projections.projectionList();
        projectionList.add(Projections.property("loan.id").as("id"));
        projectionList.add(Projections.property("loan.status").as("status"));
        projectionList.add(Projections.property("loan.code").as("code"));
        projectionList.add(Projections.property("loan.amount").as("amount"));
        projectionList.add(Projections.property("created_by.firstName").as("firstName"));
        projectionList.add(Projections.property("created_by.lastName").as("lastName"));
        projectionList.add(Projections.property("profile.name").as("profileName"));
        projectionList.add(Projections.property("loan.interestRate").as("interestRate"));
        projectionList.add(Projections.property("loan.createdAt").as("createdAt"));
        projectionList.add(Projections.property("loan.scheduleType").as("scheduleType"));
        projectionList.add(Projections.property("borrowingProduct.name").as("loanProductName"));
        return projectionList;
    }
}
