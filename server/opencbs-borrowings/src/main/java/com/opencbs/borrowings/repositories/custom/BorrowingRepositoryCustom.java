package com.opencbs.borrowings.repositories.custom;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.SimplifiedBorrowing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface BorrowingRepositoryCustom {
    List getActiveBorrowings(LocalDateTime dateTime);
    List<Borrowing> getAllActiveNotInPivotCurrency(LocalDateTime dateTime, Long currencyId);
    Page<SimplifiedBorrowing> getAll(String searchString, Pageable pageable);
}
