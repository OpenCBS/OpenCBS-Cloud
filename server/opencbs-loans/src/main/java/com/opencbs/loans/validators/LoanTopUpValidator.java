package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.EntryFee;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.NumericHelper;
import com.opencbs.core.services.EntryFeeService;
import com.opencbs.loans.analytics.loan.domain.Analytic;
import com.opencbs.loans.analytics.loan.services.AnalyticsService;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.dto.LoanTopUpDto;
import com.opencbs.loans.dto.loanapplications.LoanApplicationEntryFeeDto;
import com.opencbs.loans.repositories.LoanEventRepository;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Validator
@RequiredArgsConstructor
public class LoanTopUpValidator {

    private final LoanEventRepository loanEventRepository;
    private final LoanValidator loanValidator;
    private final EntryFeeService entryFeeService;
    private final AnalyticsService analyticsService;
    private final LoanInstallmentRepository loanInstallmentRepository;


    public void validate(LoanTopUpDto dto, Loan loan) throws ResourceNotFoundException {
        this.loanValidator.validateClosedLoan(loan.getId());
        LoanProduct loanProduct = loan.getLoanApplication().getLoanProduct();

        List<LoanInstallment> allInstallments = this.loanInstallmentRepository
                .findByLoanIdAndDateTime(loan.getId(), null);
        List<LoanInstallment> previousInstallments = allInstallments
                .stream()
                .filter(x -> x.getMaturityDate().isBefore(dto.getDisbursementDate()))
                .collect(Collectors.toList());


        Assert.notNull(dto.getAmount(), "Amount is required.");
        Assert.isTrue(
                NumericHelper.between(dto.getAmount(), loanProduct.getAmountMin(), loanProduct.getAmountMax()),
                String.format("Amount must be within the range %s and %s.",
                        loanProduct.getAmountMin(), loanProduct.getAmountMax()));

        Assert.isTrue(loanProduct.isTopUpAllow(),
                String.format("Top up is not allowed for loan product - %s", loanProduct.getName()));
        Assert.isTrue(loan.getAmount().add(dto.getAmount()).compareTo(loanProduct.getTopUpMaxLimit()) <= 0,
                String.format("Top up amount must be less than Top up max limit. Current amount: %s, top up amount: %s, max limit: %s",
                        loan.getAmount(), dto.getAmount(), loanProduct.getTopUpMaxLimit()));
        BigDecimal olb = this.getCurrentOlb(dto.getDisbursementDate(), loan);
        BigDecimal amount = olb.add(dto.getAmount());
        Assert.isTrue(amount.compareTo(loanProduct.getTopUpMaxOlb()) <= 0,
                String.format("Top up amount must be less than Top up max OLB. Current OLB: %s, top up amount: %s, max OLB: %s",
                        olb, dto.getAmount(), loanProduct.getTopUpMaxOlb()));

        Assert.notNull(dto.getInterestRate(), "Interest rate is required.");
        Assert.isTrue(
                loanProduct.getInterestRateMin().doubleValue() <= dto.getInterestRate().doubleValue()
                        && dto.getInterestRate().doubleValue() <= loanProduct.getInterestRateMax().doubleValue(),
                String.format("Interest rate has to be between %.2f and %.2f.",
                        loanProduct.getInterestRateMin().doubleValue(), loanProduct.getInterestRateMax().doubleValue()));

        Optional<LoanEvent> lastEvent = this.loanEventRepository.findAllByLoanId(loan.getId())
                .stream()
                .max(Comparator.comparing(LoanEvent::getEffectiveAt));

        Assert.notNull(dto.getDisbursementDate(), "Disbursement day is required.");
        Assert.notNull(dto.getPreferredRepaymentDate(), "Preferred repayment day is required.");

        Assert.isTrue(lastEvent.isPresent()
                        && LocalDateTime.of(dto.getDisbursementDate(), DateHelper.getLocalTimeNow()).isAfter(lastEvent.get().getEffectiveAt()),
                "Top up date can not be earlier than last event date.");

        Assert.notNull(dto.getMaturity(), "Maturity is required.");
        Assert.isTrue(
                loanProduct.getMaturityMin() <= dto.getMaturity()
                        && dto.getMaturity() <= loanProduct.getMaturityMax(),
                String.format("Maturity must be within the range %d and %d.",
                        loanProduct.getMaturityMin(), loanProduct.getMaturityMax()));

        if (dto.getGracePeriod() != null) {
            Assert.isTrue(
                    loanProduct.getGracePeriodMin() <= dto.getGracePeriod()
                            && dto.getGracePeriod() <= loanProduct.getGracePeriodMax(),
                    String.format("Grace period must be within the range %d and %d.",
                            loanProduct.getGracePeriodMin(), loanProduct.getGracePeriodMax()));
            Assert.isTrue(dto.getGracePeriod() < dto.getMaturity(),
                    "Grace period must be less than maturity");
        }

        if (dto.getEntryFees() != null) {
            for (LoanApplicationEntryFeeDto fee : dto.getEntryFees()) {
                Assert.notNull(fee.getEntryFeeId(), "Entry fee id is required.");
                EntryFee entryFee = this.entryFeeService.findOne(fee.getEntryFeeId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                String.format("Entry Fee is not found' (ID=%d).", fee.getEntryFeeId())));


                if (entryFee.isPercentage()) {
                    if (entryFee.getMinLimit() != null) {
                        Assert.isTrue(fee.getAmount().compareTo(entryFee.getMinLimit()) < 0,
                                "Amount should be more than minimum limit");
                    }

                    if (entryFee.getMaxLimit() != null) {
                        Assert.isTrue(fee.getAmount().compareTo(entryFee.getMaxLimit()) <= 0,
                                "Amount should be less than maximum limit");
                    }
                }
                else {
                    Assert.isTrue(fee.getAmount().compareTo(entryFee.getMinValue()) < 0,
                            "Amount should be more than minimum value");
                    Assert.isTrue(fee.getAmount().compareTo(entryFee.getMaxValue()) <= 0,
                            "Amount should be less than maximum value");
                }
            }
        }
    }

    private BigDecimal getCurrentOlb(LocalDate date, Loan loan) {
        Analytic calculatedAnalytic = this.analyticsService.getCalculatedAnalytic(
                loan.getId(), date.minusDays(1));

        Assert.notNull(calculatedAnalytic, String.format("Need analytics data. Close the day(%s).", date.minusDays(1)));
        return calculatedAnalytic.getOlb();
    }
}
