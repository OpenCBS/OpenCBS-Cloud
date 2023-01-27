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
public class LateInterestPenalty implements PenaltyProcessor {

    @Override
    public PenaltyType getType() {
        return PenaltyType.BY_LATE_INTEREST;
    }

    @Override
    public BigDecimal getAmountPenalty(Long loanId, LocalDate closureDate, List<LoanInstallment> loanInstallments, LoanApplicationPenalty loanApplicationPenalty) {
        final BigDecimal lateInterest = loanInstallments.stream().map(LoanInstallment::getInterestDue).reduce(BigDecimal.ZERO, BigDecimal::add);
        return PenaltyHelper.getPercentByValue(loanApplicationPenalty.getPenalty(), lateInterest, closureDate);
    }
}
