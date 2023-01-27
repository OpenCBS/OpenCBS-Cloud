package com.opencbs.borrowings.repositories.custom;

import com.opencbs.borrowings.domain.BorrowingEvent;

import java.time.LocalDateTime;
import java.util.List;

public interface BorrowingEventRepositoryCustom {
    List<BorrowingEvent> findByBorrowingIdAndEffectiveAt(Long borrowingId, LocalDateTime from, LocalDateTime to);
}
