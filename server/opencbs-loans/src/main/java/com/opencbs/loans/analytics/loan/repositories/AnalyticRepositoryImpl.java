package com.opencbs.loans.analytics.loan.repositories;

import com.opencbs.core.exceptions.ValidationException;
import com.opencbs.core.helpers.FileProvider;
import com.opencbs.core.repositories.implementations.BaseRepository;
import com.opencbs.loans.analytics.loan.domain.Analytic;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;
import java.time.LocalDateTime;

@SuppressWarnings("unused")
public class AnalyticRepositoryImpl extends BaseRepository<Analytic> implements AnalyticRepositoryCustom {

    @Autowired
    public AnalyticRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Analytic.class);
    }

    @Override
    public Analytic getAnalytic(long loanId, LocalDateTime dateTime) {
        String script;
        try {
            script = FileProvider.getLoanScript("AnalyticScript.sql");
        } catch (ValidationException e) {
            throw new RuntimeException("Analytic Script cannot be read");
        }
        Query query = this.getEntityManager().createNativeQuery(script, Analytic.class);
        query.setParameter("dateTime", dateTime);
        query.setParameter("loanId", loanId);

        try {
            Analytic singleResult = (Analytic) query.getSingleResult();
            this.getEntityManager().detach(singleResult);
            singleResult.setId(null);
            return singleResult;
        } catch (NoResultException e) {
            return null;
        }
    }
}
