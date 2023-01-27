package com.opencbs.loans.repositories;

import com.opencbs.loans.domain.LoanInterestAccrual;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanInterestAccrualRepository extends JpaRepository<LoanInterestAccrual, Long> {
}
