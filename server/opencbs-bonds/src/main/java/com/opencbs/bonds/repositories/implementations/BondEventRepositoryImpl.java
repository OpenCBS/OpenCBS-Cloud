package com.opencbs.bonds.repositories.implementations;

import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.repositories.custom.BondEventRepositoryCustom;
import com.opencbs.core.repositories.implementations.BaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class BondEventRepositoryImpl extends BaseRepository<BondEvent> implements BondEventRepositoryCustom {

    @Autowired
    public BondEventRepositoryImpl(EntityManager entityManager) {
        super(entityManager, BondEvent.class);
    }

    @Override
    public List<BondEvent> findAllByBondIdAndEffectiveAt(Long bondId, LocalDateTime from, LocalDateTime to) {
        String sql = " select b from BondEvent b " +
                "where b.effectiveAt between :from and :to " +
                "and (b.bondId = :bondId)" +
                "and (b.deleted = false)";

        Query query = this.getEntityManager().createQuery(sql);
        query.setParameter("from", from);
        query.setParameter("to", to);
        query.setParameter("bondId", bondId);
        return query.getResultList();
    }
}
