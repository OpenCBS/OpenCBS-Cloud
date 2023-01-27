package com.opencbs.loans.repositories;

import com.opencbs.loans.domain.LoanInstallmentInterestAccrual;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.time.chrono.ChronoLocalDate;
import java.util.List;
import java.util.Optional;

public interface LoanInstallmentInterestAccrualRepository extends JpaRepository<LoanInstallmentInterestAccrual, Long> {

    Optional<LoanInstallmentInterestAccrual> findByLoanIdAndNumberAndPaidInterestAndDeletedFalse(Long loanId,Integer number, BigDecimal paidInterest);

    List<LoanInstallmentInterestAccrual> findAllByLoanIdAndLastAccrualDateAfterAndPaidInterest(Long loanId, ChronoLocalDate lastAccrualDate, BigDecimal paidInterest);
}
