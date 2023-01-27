package com.opencbs.loans.services.earlyfee.impl;

import com.opencbs.loans.credit.lines.domain.CreditLine;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.enums.EarlyRepaymentFeeType;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.services.LoanApplicationService;
import com.opencbs.loans.services.earlyfee.EarlyFeeCalculationService;
import com.opencbs.loans.services.earlyfee.EarlyFeeRepaymentService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EarlyFeeRepaymentServiceImpl implements EarlyFeeRepaymentService {

    private final List<EarlyFeeCalculationService> calculationServices;
    private final LoanApplicationService loanApplicationService;

    @Override
    public BigDecimal getPartialRepaymentEarlyFee(@NonNull Long loanId, @NonNull LocalDateTime repaymentDate, @NonNull BigDecimal totalAmount, @NonNull BigDecimal olb) {
        LoanApplication loanApplication = loanApplicationService.getByLoanId(loanId);
        LoanProduct loanProduct = loanApplication.getLoanProduct();

        if (loanApplication.getCreditLine() != null) {
            CreditLine creditLine = loanApplication.getCreditLine();
            return getRepaymentEarlyFee(
                    loanId,
                    repaymentDate,
                    totalAmount,
                    olb,
                    creditLine.getEarlyPartialRepaymentFeeType(),
                    creditLine.getEarlyPartialRepaymentFeeValue()
            );
        }
        else {
            if (loanProduct.getEarlyPartialRepaymentFeeType() == null || loanProduct.getEarlyPartialRepaymentFeeValue() == null) {
                return BigDecimal.ZERO;
            }

            return getRepaymentEarlyFee(
                    loanId,
                    repaymentDate,
                    totalAmount,
                    olb,
                    loanProduct.getEarlyPartialRepaymentFeeType(),
                    loanProduct.getEarlyPartialRepaymentFeeValue()
            );
        }
    }

    @Override
    public BigDecimal getTotalRepaymentEarlyFee(@NonNull Long loanId, @NonNull LocalDateTime repaymentDate, @NonNull BigDecimal totalAmount, @NonNull BigDecimal olb) {
        LoanApplication loanApplication = loanApplicationService.getByLoanId(loanId);
        LoanProduct loanProduct = loanApplication.getLoanProduct();

        if (loanApplication.getCreditLine() != null) {
            CreditLine creditLine = loanApplication.getCreditLine();
            return getRepaymentEarlyFee(
                    loanId,
                    repaymentDate,
                    totalAmount,
                    olb,
                    creditLine.getEarlyTotalRepaymentFeeType(),
                    creditLine.getEarlyTotalRepaymentFeeValue()
            );
        }
        else {
            if (loanProduct.getEarlyTotalRepaymentFeeType() == null || loanProduct.getEarlyTotalRepaymentFeeValue() == null) {
                return BigDecimal.ZERO;
            }

            return getRepaymentEarlyFee(
                    loanId,
                    repaymentDate,
                    totalAmount,
                    olb,
                    loanProduct.getEarlyTotalRepaymentFeeType(),
                    loanProduct.getEarlyTotalRepaymentFeeValue()
            );
        }
    }

    private BigDecimal getRepaymentEarlyFee(@NonNull Long loanId, @NonNull LocalDateTime repaymentDate, @NonNull BigDecimal totalAmount, @NonNull BigDecimal olb, @NonNull EarlyRepaymentFeeType repaymentFeeType, @NonNull BigDecimal earlyFeePercent) {
        EarlyFeeCalculationService calculationService = getService(repaymentFeeType);
        return calculationService.getEarlyFeeAmount(loanId, repaymentDate, totalAmount, olb, earlyFeePercent);
    }

    private EarlyFeeCalculationService getService(@NonNull EarlyRepaymentFeeType repaymentFeeType) {
         return calculationServices.stream()
                .filter(x -> x.getType() == repaymentFeeType)
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("Early fee calculation service not found: " + repaymentFeeType));
    }
}
