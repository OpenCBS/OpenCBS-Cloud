package com.opencbs.borrowings.repositories;

import com.opencbs.borrowings.domain.BorrowingEventInterestAccrual;
import com.opencbs.core.domain.enums.EventType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowingEventInterestAccrualRepository extends JpaRepository<BorrowingEventInterestAccrual, Long> {

    List<BorrowingEventInterestAccrual> findByBorrowingIdAndEventType(Long borrowingId, EventType eventType);
}
