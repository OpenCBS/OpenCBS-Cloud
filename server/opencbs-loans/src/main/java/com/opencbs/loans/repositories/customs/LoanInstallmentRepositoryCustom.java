package com.opencbs.loans.repositories.customs;

import com.google.common.collect.ImmutableList;
import com.opencbs.loans.domain.LoanInstallment;

import java.time.LocalDateTime;


public interface LoanInstallmentRepositoryCustom {

    ImmutableList<LoanInstallment> findByLoanId(Long loanId);
    ImmutableList<LoanInstallment> findByLoanIdAndDateTime(Long loanId, LocalDateTime timestamp);
    ImmutableList<LoanInstallment> findAllByLoanIdAndEffectiveAtAndDeleted(Long loanId, LocalDateTime localDateTime, boolean deleted);
}
