package com.opencbs.borrowings.repositories;

import com.opencbs.borrowings.repositories.custom.BorrowingEventRepositoryCustom;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.repositories.Repository;
import com.opencbs.borrowings.domain.BorrowingEvent;

import java.util.List;
import java.util.Optional;

public interface BorrowingEventRepository extends Repository<BorrowingEvent>, BorrowingEventRepositoryCustom {
    List<BorrowingEvent> findAllByBorrowingId(Long borrowingId);

    List<BorrowingEvent> findAllByGroupKey(Long groupKey);

    List<BorrowingEvent> findAllByBorrowingIdAndEventTypeAndDeleted(Long borrowingId, EventType eventType, Boolean deleted);

    List<BorrowingEvent> findAllByBorrowingIdAndDeletedFalse(Long id);

    List<BorrowingEvent> findAllByAccountingEntry(AccountingEntry accountingEntry);

    Optional<BorrowingEvent> findFirstByBorrowingIdAndDeletedFalseOrderByEffectiveAtDesc(Long borrowingId);
}
