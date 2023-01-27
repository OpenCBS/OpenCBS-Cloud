package com.opencbs.loans.services.loancloseday;

import com.opencbs.core.domain.enums.PenaltyType;
import com.opencbs.loans.domain.LoanApplicationPenalty;
import com.opencbs.loans.domain.LoanInstallment;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface PenaltyProcessor {

    PenaltyType getType();

    BigDecimal getAmountPenalty(Long loanId, LocalDate closureDate, List<LoanInstallment> loanInstallment, LoanApplicationPenalty loanApplicationPenalty);
}
