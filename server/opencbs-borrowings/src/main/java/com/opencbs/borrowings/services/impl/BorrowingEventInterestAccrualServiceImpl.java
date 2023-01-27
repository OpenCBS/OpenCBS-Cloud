package com.opencbs.borrowings.services.impl;

import com.opencbs.borrowings.domain.BorrowingEventInterestAccrual;
import com.opencbs.borrowings.repositories.BorrowingEventInterestAccrualRepository;
import com.opencbs.borrowings.services.BorrowingEventInterestAccrualService;
import com.opencbs.core.domain.enums.EventType;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowingEventInterestAccrualServiceImpl implements BorrowingEventInterestAccrualService {

    private final BorrowingEventInterestAccrualRepository borrowingEventInterestAccrualRepository;


    @Override
    public List<BorrowingEventInterestAccrual> getBorrowingEvents(@NonNull Long borrowingId, @NonNull EventType eventType) {
        return borrowingEventInterestAccrualRepository.findByBorrowingIdAndEventType(borrowingId, eventType);
    }
}
