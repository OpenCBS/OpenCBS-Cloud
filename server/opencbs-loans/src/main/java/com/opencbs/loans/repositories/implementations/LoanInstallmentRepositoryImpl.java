package com.opencbs.loans.repositories.implementations;

import com.google.common.collect.ImmutableList;
import com.opencbs.core.repositories.implementations.BaseRepository;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.repositories.customs.LoanInstallmentRepositoryCustom;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.time.LocalDateTime;

@SuppressWarnings("unused")
public class LoanInstallmentRepositoryImpl extends BaseRepository<LoanInstallment> implements LoanInstallmentRepositoryCustom {

    @Autowired
    public LoanInstallmentRepositoryImpl(EntityManager entityManager) {
        super(entityManager, LoanInstallment.class);
    }

    @Override
    public ImmutableList<LoanInstallment> findByLoanId(Long loanId) {
        return findByLoanIdAndDateTime(loanId, null);
    }

    @Override
    public ImmutableList<LoanInstallment> findByLoanIdAndDateTime(Long loanId, LocalDateTime timestamp) {
        String queryString;
        if (timestamp == null) {
            queryString = "select * from get_loan_schedule(:loanId, null)";
        } else {
            queryString = "select * from get_loan_schedule(:loanId, :dateTime)";
        }
        Query query = this.getEntityManager().createNativeQuery(queryString, LoanInstallment.class);
        query.setParameter("loanId", loanId);
        if (timestamp != null) {
            query.setParameter("dateTime", timestamp);
        }

        return ImmutableList.<LoanInstallment>builder()
                .addAll(query.getResultList())
                .build();
    }

    @Override
    public ImmutableList<LoanInstallment> findAllByLoanIdAndEffectiveAtAndDeleted(Long loanId, LocalDateTime localDateTime, boolean deleted) {
        Criteria criteria = this.createCriteria("li");
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);

        Criterion where;
        if(localDateTime != null){
            where = Restrictions.conjunction(Restrictions.eq("li.loanId", loanId))
                    .add(Restrictions.eq("li.deleted", deleted))
                    .add(Restrictions.le("li.effectiveAt", localDateTime));
        } else {
            where = Restrictions.conjunction(Restrictions.eq("li.loanId", loanId))
                    .add(Restrictions.eq("li.deleted", deleted));
        }
        criteria.add(where);

        return ImmutableList.<LoanInstallment>builder()
                .addAll(criteria.list())
                .build();
    }
}
