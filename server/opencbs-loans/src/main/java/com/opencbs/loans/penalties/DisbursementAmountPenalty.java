package com.opencbs.loans.penalties;

import com.opencbs.core.domain.enums.PenaltyType;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanApplicationPenalty;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.services.loancloseday.PenaltyProcessor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor

@Service
public class DisbursementAmountPenalty implements PenaltyProcessor {

    private final LoanService loanService;

    @Override
    public PenaltyType getType() {
        return PenaltyType.BY_DISBURSEMENT_AMOUNT;
    }

    @Override
    public BigDecimal getAmountPenalty(Long loanId, LocalDate closureDate, List<LoanInstallment> loanInstallments, LoanApplicationPenalty loanApplicationPenalty) {
        Loan loan = loanService.getLoanById(loanId);
        return PenaltyHelper.getPercentByValue(loanApplicationPenalty.getPenalty(), loan.getAmount(), closureDate);
    }
}
