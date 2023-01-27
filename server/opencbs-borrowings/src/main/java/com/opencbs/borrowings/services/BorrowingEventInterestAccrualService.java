package com.opencbs.borrowings.services;

import com.opencbs.borrowings.domain.BorrowingEventInterestAccrual;
import com.opencbs.core.domain.enums.EventType;

import java.util.List;

public interface BorrowingEventInterestAccrualService {

    List<BorrowingEventInterestAccrual> getBorrowingEvents(Long borrowingId, EventType eventType);
}
