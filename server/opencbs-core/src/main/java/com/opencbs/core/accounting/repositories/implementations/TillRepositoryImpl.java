package com.opencbs.core.accounting.repositories.implementations;

import com.opencbs.core.accounting.repositories.customs.TillRepositoryCustom;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.till.Operation;
import com.opencbs.core.domain.till.Till;
import com.opencbs.core.repositories.implementations.BaseRepository;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.transform.AliasToBeanResultTransformer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

@SuppressWarnings("unused")
public class TillRepositoryImpl extends BaseRepository<Till> implements TillRepositoryCustom {
    protected TillRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Till.class);
    }

    @Override
    public Page<Operation> getOperationsByCurrency(Pageable pageable, Till till, Currency currency, LocalDateTime fromDate, LocalDateTime toDate) {
        return this.getOperations(pageable, till.getId(), currency.getId(), fromDate, toDate);
    }

    @Override
    public Page<Operation> getOperations(Pageable pageable, Till till, LocalDateTime fromDate, LocalDateTime toDate) {
        return this.getOperations(pageable, till.getId(), 0, fromDate, toDate);
    }

    @Override
    public Page<Till> search(Pageable pageable, String searchString) {
        String queryString = "from tills where \"name\" ilike :searchString";
        Query totalQuery = this.getEntityManager().createNativeQuery("select count(*) " + queryString);
        totalQuery.setParameter("searchString", String.format("%%%s%%", searchString));
        BigInteger total = (BigInteger) totalQuery.getSingleResult();

        Query query = this.getEntityManager().createNativeQuery("select * " + queryString, Till.class);
        query.setParameter("searchString", String.format("%%%s%%", searchString));
        query.setFirstResult(pageable.getPageSize() * pageable.getPageNumber());
        query.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(query.getResultList(), pageable, total.longValue());
    }

    private Page<Operation> getOperations(Pageable pageable, long tillId, long currencyId, LocalDateTime fromDate, LocalDateTime toDate) {

        Criteria criteria = createCriteria(Operation.class,"o");

        criteria.add(
                Restrictions.conjunction(Restrictions.eq("o.tillId", tillId))
                        .add(Restrictions.between("o.effectiveAt", fromDate, toDate ))
        );
        if (currencyId != 0) {
            criteria.add(Restrictions.eq("o.currency.id", currencyId));
        }

        criteria.setFirstResult(0);
        Long total = (Long) criteria.setProjection(Projections.rowCount()).uniqueResult();

        criteria.addOrder(Order.desc("o.effectiveAt"));
        criteria.setProjection(getProjection());
        criteria.setMaxResults(pageable.getPageSize());
        criteria.setFirstResult(pageable.getPageSize() * pageable.getPageNumber());
        List<Operation> operations = (List<Operation>)criteria.setResultTransformer(new AliasToBeanResultTransformer(Operation.class)).list();

        return new PageImpl<>(operations, pageable, total);
    }

    private Projection getProjection() {
        return Projections.projectionList()
                .add(Projections.property("o.id").as("id"))
                .add(Projections.property("o.effectiveAt").as("effectiveAt"))
                .add(Projections.property("o.profileId").as("profileId"))
                .add(Projections.property("o.profileName").as("profileName"))
                .add(Projections.property("o.vaultName").as("vaultName"))
                .add(Projections.property("o.amount").as("amount"))
                .add(Projections.property("o.operationType").as("operationType"))
                .add(Projections.property("o.createdBy").as("createdBy"))
                .add(Projections.property("o.currency").as("currency"))
                .add(Projections.property("o.description").as("description"))
                .add(Projections.property("o.tillId").as("tillId"));
    }

    @Override
    public Page<User> findAllTeller(Pageable pageable, String searchString) {
        String queryString = "from users u\n" +
                " left join roles_permissions r on r.role_id = u.role_id\n"+
                " where (lower (u.first_name) || lower (u.last_name) like lower (:searchString))\n"+
                " and r.permission_id in (4, 3)";
        Query totalQuery = this.getEntityManager().createNativeQuery("select count(*)" + queryString);
        totalQuery.setParameter("searchString", String.format("%%%s%%", searchString));
        BigInteger total = (BigInteger) totalQuery.getSingleResult();

        Query query = this.getEntityManager().createNativeQuery("select distinct u.*" + queryString, User.class);
        query.setParameter("searchString", String.format("%%%s%%", searchString));
        query.setFirstResult(pageable.getPageSize() * pageable.getPageNumber());
        query.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(query.getResultList(), pageable, total.longValue());
    }
}
