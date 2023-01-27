package com.opencbs.borrowings.repositories;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.core.repositories.Repository;
import com.opencbs.borrowings.domain.schedule.BorrowingInstallment;

import java.util.List;

public interface BorrowingInstallmentRepository extends Repository<BorrowingInstallment> {
    List<BorrowingInstallment> findAllByBorrowing(Borrowing borrowing);
    List<BorrowingInstallment> findAllByBorrowingIdAndDeletedFalse(Long borrowingId);
}
