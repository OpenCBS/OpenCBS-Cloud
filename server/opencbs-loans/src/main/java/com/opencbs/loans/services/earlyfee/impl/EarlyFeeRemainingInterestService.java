package com.opencbs.loans.services.earlyfee.impl;

import com.opencbs.core.helpers.DateHelper;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.domain.enums.EarlyRepaymentFeeType;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.services.LoanService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EarlyFeeRemainingInterestService extends EarlyFeeBaseCalculationService {

    private final LoanInstallmentRepository installmentRepository;
    private final LoanService loanService;


    @Override
    public BigDecimal getEarlyFeeAmount(@NonNull Long loanId,
                                        @NonNull LocalDateTime timestamp,
                                        @NonNull BigDecimal totalAmount,
                                        @NonNull BigDecimal olb,
                                        @NonNull BigDecimal percent) {

        List<LoanInstallment> installments = installmentRepository.findByLoanIdAndDateTime(loanId, timestamp);
        BigDecimal interest = installments.stream()
                .filter(loanInstallment -> DateHelper.greater(loanInstallment.getMaturityDate(), timestamp.toLocalDate()))
                .map(x -> getInterestAmount(x, timestamp.toLocalDate()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expiredInstallmentsInterestAmount = getExpiredInstallmentsInterestRepaymentAmount(installments, timestamp.toLocalDate());

        return getFeeAmount(interest.add(expiredInstallmentsInterestAmount), percent);
    }

    @Override
    public EarlyRepaymentFeeType getType() {
        return EarlyRepaymentFeeType.REMAINING_INTEREST;
    }

    private BigDecimal getInterestAmount(@NonNull LoanInstallment installment, @NonNull LocalDate repaymentDate) {
        if (repaymentDate.isAfter(installment.getAccrualStartDate()) && repaymentDate.isBefore(installment.getLastAccrualDate())) {
            return getInterestForPeriod(
                    loanService.getLoanById(installment.getLoanId()),
                    installment.getOlb(),
                    DateHelper.daysBetweenAs_30_360(installment.getAccrualStartDate(), repaymentDate)
            );
        }

        return installment.getAccruedInterest().subtract(installment.getPaidInterest());
    }

    private BigDecimal getExpiredInstallmentsInterestRepaymentAmount(@NonNull List<LoanInstallment> installments, @NonNull LocalDate repaymentDate) {

        Optional<LoanInstallment> optionalLoanInstallment = installments.stream()
                .filter(x -> DateHelper.less(x.getMaturityDate(), repaymentDate))
                .max(Comparator.comparing(LoanInstallment::getNumber));

        if (!optionalLoanInstallment.isPresent()) {
            return BigDecimal.ZERO;
        }

        final LoanInstallment loanInstallment = optionalLoanInstallment.get();
        final Loan loan = this.loanService.getLoanById(loanInstallment.getLoanId());
        return getInterestForPeriod(loan, loanInstallment.getOlb(),
                DateHelper.daysBetweenAs_30_360(repaymentDate, loanInstallment.getMaturityDate()));
    }

    private BigDecimal getInterestForPeriod(@NonNull Loan loan, @NonNull BigDecimal olb, long daysCount) {
        return olb.multiply(loan.getInterestRate().divide(BigDecimal.valueOf(100), ROUND_MODE))
                .multiply(BigDecimal.valueOf(daysCount))
                .divide(BigDecimal.valueOf(360), ROUND_MODE)
                .setScale(DECIMAL_PLACE, ROUND_MODE);
    }
}
