package com.opencbs.loans.repositories.audit;

import com.opencbs.loans.domain.LoanHistory;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
public class LoanAuditRepository {

    @PersistenceContext
    private EntityManager entityManager;


    public LoanHistory findAuditByRevision(Integer id, int revision) {
        AuditReader auditReader = AuditReaderFactory.get(entityManager);
        return auditReader.find(LoanHistory.class, id, revision);
    }
}
