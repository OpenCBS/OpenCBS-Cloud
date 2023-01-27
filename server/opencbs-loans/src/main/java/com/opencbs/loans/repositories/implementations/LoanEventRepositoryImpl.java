package com.opencbs.loans.repositories.implementations;

import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.repositories.implementations.BaseRepository;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.repositories.customs.LoanEventRepositoryCustom;
import org.hibernate.Criteria;
import org.hibernate.criterion.CriteriaSpecification;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class LoanEventRepositoryImpl extends BaseRepository<LoanEvent> implements LoanEventRepositoryCustom {

    @Autowired
    public LoanEventRepositoryImpl(EntityManager entityManager) {
        super(entityManager, LoanEvent.class);
    }

    @Override
    public List<LoanEvent> findAllByLoanIdAndDeletedAndEventTypeAndEffectiveAt(Long loanId, boolean isDeleted, EventType eventType, LocalDateTime localDateTime) {
        Criteria criteria = this.createCriteria("le");
        criteria.setResultTransformer(CriteriaSpecification.DISTINCT_ROOT_ENTITY);

        Criterion where;
        if (localDateTime != null){
            where = Restrictions.conjunction(Restrictions.eq("le.loanId", loanId))
                    .add(Restrictions.eq("le.deleted", isDeleted))
                    .add(Restrictions.eq("le.eventType", eventType))
                    .add(Restrictions.le("le.effectiveAt", localDateTime));
        } else {
            where = Restrictions.conjunction(Restrictions.eq("le.loanId", loanId))
                    .add(Restrictions.eq("le.deleted", isDeleted))
                    .add(Restrictions.eq("le.eventType", eventType));
        }
        criteria.add(where);

        return criteria.list();
    }

    @Override
    public List<LoanEvent> findAllByLoanIdAndEffectiveAt(Long loanId, LocalDateTime from, LocalDateTime to) {
        String sql = " select l from LoanEvent l " +
                "where l.effectiveAt between :from and :to " +
                "and (l.loanId = :loanId)" +
                "and (l.deleted = false)";

        Query query = this.getEntityManager().createQuery(sql);
        query.setParameter("from", from);
        query.setParameter("to", to);
        query.setParameter("loanId", loanId);
        return query.getResultList();
    }



    @Override
    public List<LoanEvent> findAllByLoanIdAndDeletedAndEventTypeAndEffectiveAtBetween(Long loanId,boolean isDeleted, EventType eventType, LocalDateTime startPeriod, LocalDateTime endPeriod) {
        Criteria criteria = this.createCriteria("le");
        criteria.setResultTransformer(CriteriaSpecification.DISTINCT_ROOT_ENTITY);

        Criterion where;
        if (startPeriod != null && endPeriod != null){
            where = Restrictions.conjunction(Restrictions.eq("le.loanId", loanId))
                    .add(Restrictions.eq("le.deleted", isDeleted))
                    .add(Restrictions.eq("le.eventType", eventType))
                    .add(Restrictions.between("le.effectiveAt", startPeriod, endPeriod));
        } else {
            where = Restrictions.conjunction(Restrictions.eq("le.loanId", loanId))
                    .add(Restrictions.eq("le.deleted", isDeleted))
                    .add(Restrictions.eq("le.eventType", eventType));
        }
        criteria.add(where);

        return criteria.list();
    }
}
