package com.opencbs.loans.repositories;

import com.opencbs.loans.domain.LoanGainLoss;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanGainLossRepository extends JpaRepository<LoanGainLoss, Long> {
}
