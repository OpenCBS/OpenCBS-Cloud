package com.opencbs.borrowings.repositories;

import com.opencbs.borrowings.domain.BorrowingInterestAccrual;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowingInterestAccrualRepository extends JpaRepository<BorrowingInterestAccrual, Long> {
}
