package com.opencbs.core.accounting.repositories.implementations;

import com.github.fluent.hibernate.transformer.FluentHibernateResultTransformer;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.dto.SortedAccountingEntryDto;
import com.opencbs.core.accounting.repositories.customs.AccountingEntryRepositoryCustom;
import com.opencbs.core.repositories.implementations.BaseRepository;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.sql.JoinType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@SuppressWarnings("unused")
public class AccountingEntryRepositoryImpl extends BaseRepository<AccountingEntry> implements AccountingEntryRepositoryCustom {

    @Autowired
    public AccountingEntryRepositoryImpl(EntityManager entityManager) {
        super(entityManager, AccountingEntry.class);
    }

    @Override
    public List<AccountingEntry> getAccountingEntriesByAccount(Account account, LocalDateTime from, LocalDateTime to) {
        String sql = "select a from AccountingEntry a " +
                "where a.effectiveAt between :from and :to " +
                "and (a.debitAccount.id = :accountId or a.creditAccount.id = :accountId)" +
                "and (a.deleted = false)";

        Query query = this.getEntityManager().createQuery(sql);
        query.setParameter("from", from);
        query.setParameter("to", to);
        query.setParameter("accountId", account.getId());
        return query.getResultList();
    }

    @Override
    public Boolean hasTransactions(Long accountId) {
        String hql = "select case when count(*) > 0 then true else false end\n " +
                "from AccountingEntry as ae\n " +
                "where ae.debitAccount.id = :accountId or ae.creditAccount.id = :accountId\n " +
                "and now() > ae.createdAt";
        Query query = this.getEntityManager().createQuery(hql);
        query.setParameter("accountId", accountId);
        return (Boolean) query.getSingleResult();
    }

    @Override
    public List<AccountingEntry> getAccountingEntries(LocalDateTime startDate, LocalDateTime endDate) {
        Criteria criteria = createCriteria("a");
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);

        Criterion criterionStart = Restrictions.ge("a.effectiveAt", startDate);
        Criterion criterionEnd = Restrictions.lt("a.effectiveAt", endDate);
        Criterion criterion = Restrictions.and(criterionStart, criterionEnd);
        criteria.add(criterion);

        Criterion criterionDelete = Restrictions.eq("deleted", false);
        criteria.add(criterionDelete);

        return criteria.list();
    }

    @Override
    public Page<AccountingEntry> getAll(SortedAccountingEntryDto sortedAccountingEntryDto, Pageable pageable, List<Long> accountIds) {
        Criterion criterion = Restrictions.eq("deleted", false);

        Criteria criteria = this.getCriteria();
        criteria.createAlias("debitAccount", "debAccount", JoinType.LEFT_OUTER_JOIN);
        criteria.createAlias("creditAccount", "creAccount", JoinType.LEFT_OUTER_JOIN);
        criteria.createAlias("createdBy", "createdBy", JoinType.LEFT_OUTER_JOIN);
        criteria.createAlias("branch", "branch", JoinType.LEFT_OUTER_JOIN);

        if ((accountIds != null) && (!accountIds.isEmpty())) {
            criteria.add(Restrictions.or(
                    Restrictions.in("debitAccount.id", accountIds),
                    Restrictions.in("creditAccount.id", accountIds)
            ));
        }
        if(sortedAccountingEntryDto.getFromDate() != null){
            criteria.add(Restrictions.ge("effectiveAt",
                    LocalDateTime.of(sortedAccountingEntryDto.getFromDate(),LocalTime.MIN)));
        }
        if(sortedAccountingEntryDto.getToDate() != null){
            criteria.add(Restrictions.le("effectiveAt",
                    LocalDateTime.of(sortedAccountingEntryDto.getToDate(),LocalTime.MAX)));
        }

        if(!sortedAccountingEntryDto.getShowSystem()){
            criteria.add(Restrictions.ne("createdBy.isSystemUser",true));
        }

        criteria.add(criterion);
        long total = (long) criteria.setProjection(Projections.rowCount()).uniqueResult();
        criteria.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        criteria.setMaxResults(pageable.getPageSize());
        criteria.addOrder(Order.desc("effectiveAt"));
        criteria.addOrder(Order.asc("id"));

        criteria.setProjection(this.getProjectionList());
        criteria.setResultTransformer(new FluentHibernateResultTransformer(AccountingEntry.class));

        return new PageImpl<>(criteria.list(), pageable, total);
    }

    @Override
    public Page<AccountingEntry> getAll(SortedAccountingEntryDto sortedAccountingEntryDto, Pageable pageable) {
        return this.getAll(sortedAccountingEntryDto, pageable, null);
    }

    private Criteria getCriteria() {
        Criteria criteria = this.createCriteria("ae");
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
        return criteria;
    }

    private ProjectionList getProjectionList() {
        ProjectionList projectionList = Projections.projectionList();
        projectionList.add(Projections.property("ae.id").as("id"));
        projectionList.add(Projections.property("ae.amount").as("amount"));
        projectionList.add(Projections.property("ae.description").as("description"));
        projectionList.add(Projections.property("ae.createdAt").as("createdAt"));
        projectionList.add(Projections.property("ae.effectiveAt").as("effectiveAt"));
        projectionList.add(Projections.property("debAccount.id").as("debitAccount.id"));
        projectionList.add(Projections.property("debAccount.name").as("debitAccount.name"));
        projectionList.add(Projections.property("debAccount.number").as("debitAccount.number"));
        projectionList.add(Projections.property("creAccount.id").as("creditAccount.id"));
        projectionList.add(Projections.property("creAccount.name").as("creditAccount.name"));
        projectionList.add(Projections.property("creAccount.number").as("creditAccount.number"));
        projectionList.add(Projections.property("branch.name").as("branch.name"));
        projectionList.add(Projections.property("createdBy.firstName").as("createdBy.firstName"));
        projectionList.add(Projections.property("createdBy.lastName").as("createdBy.lastName"));
        projectionList.add(Projections.property("createdBy.username").as("createdBy.username"));
        return projectionList;
    }
}
