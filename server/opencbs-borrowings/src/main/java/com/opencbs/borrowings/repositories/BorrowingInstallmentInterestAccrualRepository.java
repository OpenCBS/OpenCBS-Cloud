package com.opencbs.borrowings.repositories;

import com.opencbs.borrowings.domain.schedule.BorrowingInstallmentInterestAccrual;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BorrowingInstallmentInterestAccrualRepository extends JpaRepository<BorrowingInstallmentInterestAccrual, Long> {

    List<BorrowingInstallmentInterestAccrual> findByBorrowingIdAndAndDeletedIsTrueAndEffectiveAtIsLessThanEqual(Long borrowingId, LocalDateTime currentTime);
}
