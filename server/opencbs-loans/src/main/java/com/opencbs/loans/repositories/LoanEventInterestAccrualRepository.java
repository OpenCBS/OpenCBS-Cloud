package com.opencbs.loans.repositories;

import com.opencbs.core.domain.enums.EventType;
import com.opencbs.loans.domain.LoanEventInterestAccrual;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LoanEventInterestAccrualRepository extends JpaRepository<LoanEventInterestAccrual, Long> {

    Optional<LoanEventInterestAccrual> findFirstByLoanIdAndEventType(Long LoanId, EventType eventType);

    List<LoanEventInterestAccrual> findByLoanIdAndEventTypeAndInstallmentNumber(Long LoanId, EventType eventType, Integer installmentNumber);
}
