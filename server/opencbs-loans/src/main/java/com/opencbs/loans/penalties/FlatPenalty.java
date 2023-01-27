package com.opencbs.loans.penalties;

import com.opencbs.core.domain.enums.PenaltyType;
import com.opencbs.loans.domain.LoanApplicationPenalty;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.services.loancloseday.PenaltyProcessor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class FlatPenalty implements PenaltyProcessor {

    @Override
    public PenaltyType getType() {
        return PenaltyType.FLAT;
    }

    @Override
    public BigDecimal getAmountPenalty(Long loanId, LocalDate closureDate, List<LoanInstallment> loanInstallments, LoanApplicationPenalty loanApplicationPenalty) {
       return loanApplicationPenalty.getPenalty();
    }
}
