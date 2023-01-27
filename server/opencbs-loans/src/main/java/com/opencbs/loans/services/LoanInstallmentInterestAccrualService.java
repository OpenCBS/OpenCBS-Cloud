package com.opencbs.loans.services;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface LoanInstallmentInterestAccrualService {

    LocalDate getAccrualDate(Long loanId, Integer installmentNumber);

    Integer getInstallmentNumber(Long loanId, LocalDate currentDay);

    BigDecimal getInstallmentInterest(Long loanId, Integer installmentNumber);

    BigDecimal getInstallmentOlb(Long loanId, LocalDate currentDay);

    LocalDate getLastAccrualDate(Long loanId, LocalDate currentDay);
}
