package com.opencbs.loans.credit.lines.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.services.PenaltyService;
import com.opencbs.core.services.ProfileService;
import com.opencbs.loans.credit.lines.domain.CreditLine;
import com.opencbs.loans.credit.lines.dto.CreditLineCreateDto;
import com.opencbs.loans.credit.lines.services.CreditLineService;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.services.LoanProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.Optional;

@Validator
@RequiredArgsConstructor
public class CreditLineValidator {

    private final CreditLineService creditLineService;
    private final LoanProductService loanProductService;
    private final PenaltyService penaltyService;
    private final ProfileService profileService;

    public void validate(CreditLineCreateDto creditLineCreateDto) {
        Assert.notNull(creditLineCreateDto.getProfileId(), "Profile ID is required.");
        this.profileService.findOne(creditLineCreateDto.getProfileId()).orElseThrow(() -> new ResourceNotFoundException(String.format("Profile not found (ID=%d).", creditLineCreateDto.getProfileId())));

        Assert.isTrue(!StringUtils.isEmpty(creditLineCreateDto.getName()), "Name is required.");
        Assert.isTrue(!StringUtils.isEmpty(creditLineCreateDto.getName().trim()), "Name is required.");
//        Optional<CreditLine> existingCreditLine = this.creditLineService.getByName(creditLineCreateDto.getName());
//        existingCreditLine.ifPresent(creditLine -> Assert.isTrue(creditLine.getId().equals(creditLineCreateDto.getId()), "Name is taken."));

        Assert.notNull(creditLineCreateDto.getStartDate(), "Credit line start date is required.");
        Assert.notNull(creditLineCreateDto.getLastDisbursementDate(), "Credit line last disbursement date is required.");
        Assert.notNull(creditLineCreateDto.getMaturityDate(), "Credit line maturity date is required.");

        Assert.isTrue(creditLineCreateDto.getLastDisbursementDate().isAfter(creditLineCreateDto.getStartDate()), "Last disbursement date should be after start date.");
        Assert.isTrue(creditLineCreateDto.getMaturityDate().isAfter(creditLineCreateDto.getLastDisbursementDate()), "Maturity date should be after last disbursement date.");

        Assert.notNull(creditLineCreateDto.getCommittedAmount(), "Credit line committed amount is required.");
        Assert.isTrue(creditLineCreateDto.getCommittedAmount().compareTo(BigDecimal.ZERO) > 0, "Credit line committed amount should be greater than zero.");

        Assert.notNull(creditLineCreateDto.getDisbursementAmountMin(), "Credit line disbursement amount min is required.");
        Assert.isTrue(creditLineCreateDto.getDisbursementAmountMin().compareTo(BigDecimal.ZERO) > 0, "Credit line disbursement amount min should be greater than zero.");

        Assert.notNull(creditLineCreateDto.getDisbursementAmountMax(), "Credit line disbursement amount max is required.");
        Assert.isTrue(creditLineCreateDto.getDisbursementAmountMax().compareTo(BigDecimal.ZERO) > 0, "Credit line disbursement amount max should be greater than zero.");
        Assert.isTrue(creditLineCreateDto.getDisbursementAmountMin().compareTo(creditLineCreateDto.getDisbursementAmountMax()) <= 0, "Disbursement amount min should be less or equal to max amount.");

        if (creditLineCreateDto.getLoanProductId() != null) {
            Optional<LoanProduct> loanProduct = this.loanProductService.getOne(creditLineCreateDto.getLoanProductId());
            Assert.isTrue(loanProduct.isPresent(), "Invalid Loan Product.");
        }

        Assert.notNull(creditLineCreateDto.getInterestRateMin(), "Minimum interest rate is required.");
        Assert.isTrue(creditLineCreateDto.getInterestRateMin().doubleValue() >= 0, "Minimum interest rate should be greater than zero.");
        Assert.isTrue(creditLineCreateDto.getInterestRateMin().precision()
                - creditLineCreateDto.getInterestRateMin().scale() <= 4, "Minimum interest rate should be less than 10000.");

        Assert.notNull(creditLineCreateDto.getInterestRateMax(), "Maximum interest rate is required.");
        Assert.isTrue(creditLineCreateDto.getInterestRateMax().doubleValue() > 0, "Maximum interest rate should be greater than zero.");
        Assert.isTrue((creditLineCreateDto.getInterestRateMax().precision()
                - creditLineCreateDto.getInterestRateMax().scale()) <= 4, "Maximum interest rate should be less than 10000.");
        Assert.isTrue(creditLineCreateDto.getInterestRateMin().doubleValue() <= creditLineCreateDto.getInterestRateMax().doubleValue(),
                "Minimum interest rate should be less than or equal to the maximum value.");

        for (Long id : creditLineCreateDto.getPenalties()) {
            Assert.isTrue(this.penaltyService.get(id).isPresent(), String.format("Penalty not found (ID=%d)", id));
        }

        Assert.notNull(creditLineCreateDto.getStructuringFees(), "Structuring Fees are required");
        Assert.notNull(creditLineCreateDto.getEntryFees(), "Entry Fees are required");
        Assert.notNull(creditLineCreateDto.getEarlyPartialRepaymentFeeValue(), "Early partial repayment fee value is required");
        Assert.notNull(creditLineCreateDto.getEarlyPartialRepaymentFeeType(), "Early partial repayment fee type is required");
        Assert.notNull(creditLineCreateDto.getEarlyTotalRepaymentFeeValue(), "Early total repayment fee value is required");
        Assert.notNull(creditLineCreateDto.getEarlyTotalRepaymentFeeType(), "Early total repayment fee type is required");
    }
}
