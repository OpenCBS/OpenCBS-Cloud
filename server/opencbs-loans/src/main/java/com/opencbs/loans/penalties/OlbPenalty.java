package com.opencbs.loans.penalties;

import com.opencbs.core.domain.enums.PenaltyType;
import com.opencbs.loans.domain.LoanApplicationPenalty;
import com.opencbs.loans.domain.LoanInfo;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.services.loancloseday.PenaltyProcessor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OlbPenalty implements PenaltyProcessor {

    private final LoanService loanService;


    @Override
    public BigDecimal getAmountPenalty(Long loanId, LocalDate closureDate, List<LoanInstallment> loanInstallments, LoanApplicationPenalty loanApplicationPenalty) {
        LoanInfo loanInfo = loanService.getLoanInfo(loanId, closureDate);
        return PenaltyHelper.getPercentByValue(loanInfo.getOlb(), loanApplicationPenalty.getPenalty(), closureDate);
    }

    @Override
    public PenaltyType getType() {
        return PenaltyType.BY_OLB;
    }
}
