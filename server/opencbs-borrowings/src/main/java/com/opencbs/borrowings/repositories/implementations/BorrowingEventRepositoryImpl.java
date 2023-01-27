package com.opencbs.borrowings.repositories.implementations;

import com.opencbs.borrowings.domain.BorrowingEvent;
import com.opencbs.borrowings.repositories.custom.BorrowingEventRepositoryCustom;
import com.opencbs.core.repositories.implementations.BaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class BorrowingEventRepositoryImpl extends BaseRepository<BorrowingEvent> implements BorrowingEventRepositoryCustom {

    @Autowired
    public BorrowingEventRepositoryImpl(EntityManager entityManager) {
        super(entityManager, BorrowingEvent.class);
    }

    @Override
    public List<BorrowingEvent> findByBorrowingIdAndEffectiveAt(Long borrowingId, LocalDateTime from, LocalDateTime to) {
        String sql = " select b from BorrowingEvent b " +
                "where b.effectiveAt between :from and :to " +
                "and (b.borrowingId = :borrowingId)" +
                "and (b.deleted = false)";

        Query query = this.getEntityManager().createQuery(sql);
        query.setParameter("from", from);
        query.setParameter("to", to);
        query.setParameter("borrowingId", borrowingId);
        return query.getResultList();
    }
}
