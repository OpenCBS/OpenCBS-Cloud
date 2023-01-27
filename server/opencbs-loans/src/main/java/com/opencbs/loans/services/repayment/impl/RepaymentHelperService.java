package com.opencbs.loans.services.repayment.impl;

import com.opencbs.core.domain.BaseInstallment;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.schedulegenerators.ScheduleService;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.domain.LoanPenaltyAmount;
import com.opencbs.loans.services.LoanApplicationService;
import com.opencbs.loans.services.LoanPenaltyEventService;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.services.earlyfee.EarlyFeeRepaymentService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Service
public class RepaymentHelperService {

    private static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_EVEN;
    private static final int DECIMAL_PLACE = 2;

    protected final ScheduleService scheduleService;
    protected final LoanApplicationService loanApplicationService;
    protected final LoanPenaltyEventService loanPenaltyEventService;
    protected final LoanService loanService;
    protected final EarlyFeeRepaymentService feeRepaymentService;


    public BigDecimal calculateInterest(@NonNull Loan loan, @NonNull BigDecimal olb, long daysCount) {
        return olb.multiply(
                loan.getInterestRate()
                        .divide(BigDecimal.valueOf(100), ROUNDING_MODE)
        )
                .multiply(BigDecimal.valueOf(daysCount))
                .divide(BigDecimal.valueOf(360), ROUNDING_MODE)
                .setScale(DECIMAL_PLACE, ROUNDING_MODE);
    }

    public BigDecimal getEarlyTotalRepaymentAmount(@NonNull Long loanId, @NonNull List<LoanInstallment> installments, @NonNull LocalDateTime repaymentDate) {
        List<LoanPenaltyAmount> penaltyAmounts = loanPenaltyEventService.getPenaltyAmounts(loanId, repaymentDate.toLocalDate());
        BigDecimal interest;
        BigDecimal penalty = penaltyAmounts.stream()
                .map(LoanPenaltyAmount::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (repaymentDate.toLocalDate().compareTo(installments.get(installments.size()-1).getMaturityDate()) > 0) {
            interest = installments.stream()
                    .map(li -> li.getAccruedInterest().subtract(li.getPaidInterest()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        } else {
            interest = installments.stream()
                    .map(x -> {
                        if (repaymentDate.toLocalDate().isAfter(x.getAccrualStartDate()) &&
                                repaymentDate.toLocalDate().isBefore(x.getLastAccrualDate())) {
                            return this.calculateInterest(loanService.getLoanById(x.getLoanId()),
                                    x.getOlb(),
                                    DateHelper.daysBetweenAs_30_360(x.getAccrualStartDate(), repaymentDate.toLocalDate())
                            );
                        }

                        return x.getAccruedInterest().subtract(x.getPaidInterest());
                    })
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }
        BigDecimal principal = installments.stream()
                .map(x -> x.getPrincipal().subtract(x.getPaidPrincipal()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal olb = installments.stream()
                .filter(x -> DateHelper.greater(x.getMaturityDate(), repaymentDate.toLocalDate()) && !x.isPaid())
                .min(Comparator.comparing(BaseInstallment::getNumber))
                .map(LoanInstallment::getOlb)
                .orElse(BigDecimal.ZERO);


        ExpiredRepaymentSplit expiredRepaymentAmount = this.getExpiredInstallmentsRepaymentAmount(
                loanId,
                installments,
                repaymentDate.toLocalDate()
        );

        BigDecimal earlyRepaymentTotalAmount = principal.add(interest).add(penalty).subtract(expiredRepaymentAmount.getTotal());
        BigDecimal earlyRepaymentFee = BigDecimal.ZERO;
        if (repaymentDate.toLocalDate().compareTo(installments.get(installments.size()-1).getMaturityDate()) < 0) {
            earlyRepaymentFee = feeRepaymentService.getTotalRepaymentEarlyFee(loanId, repaymentDate, earlyRepaymentTotalAmount, olb);
        }
        return earlyRepaymentFee.add(principal).add(interest).add(penalty);
    }

    public ExpiredRepaymentSplit getExpiredInstallmentsRepaymentAmount(@NonNull Long loanId, @NonNull List<LoanInstallment> installments, @NonNull LocalDate repaymentDate) {
        List<LoanInstallment> expiredInstallments = installments.stream()
                .filter(x -> x.getMaturityDate().compareTo(repaymentDate) <= 0)
                .collect(Collectors.toList());

        BigDecimal principal = expiredInstallments.stream()
                .map(LoanInstallment::getPrincipalDue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal interest = expiredInstallments.stream()
                .map(LoanInstallment::getInterestDueFromAccrual).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal penalty = loanPenaltyEventService.getPenaltyAmount(loanId,repaymentDate);

        return ExpiredRepaymentSplit.builder()
                .penalty(penalty)
                .interest(interest)
                .principal(principal)
                .build();
    }
}