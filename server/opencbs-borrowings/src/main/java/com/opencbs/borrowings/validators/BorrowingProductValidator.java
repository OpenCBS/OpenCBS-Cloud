package com.opencbs.borrowings.validators;

import com.opencbs.borrowings.domain.BorrowingProduct;
import com.opencbs.borrowings.domain.enums.BorrowingRuleType;
import com.opencbs.borrowings.dto.BorrowingProductDto;
import com.opencbs.borrowings.services.BorrowingProductService;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.validators.BaseValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.util.Map;
import java.util.Optional;

@Validator
public class BorrowingProductValidator extends BaseValidator {

    private final BorrowingProductService borrowingProductService;
    private final CurrencyService currencyService;
    private final AccountService accountService;

    @Autowired
    public BorrowingProductValidator(BorrowingProductService borrowingProductService,
                                     CurrencyService currencyService,
                                     AccountService accountService) {
        this.borrowingProductService = borrowingProductService;
        this.currencyService = currencyService;
        this.accountService = accountService;
    }

    public void validateOnCreate(BorrowingProductDto borrowingProductDto) {
        this.stringIsNotEmpty(borrowingProductDto.getName(), "Name is required.");
        Assert.isTrue(!this.borrowingProductService.findByName(borrowingProductDto.getName()).isPresent(), "Name is taken.");
        this.stringIsNotEmpty(borrowingProductDto.getCode(), "Code is required.");
        Assert.isTrue(!this.borrowingProductService.findByCode(borrowingProductDto.getCode()).isPresent(), "Code is taken.");
        this.validate(borrowingProductDto);
    }

    public void validateOnUpdate(BorrowingProductDto borrowingProductDto) {
        this.stringIsNotEmpty(borrowingProductDto.getName(), "Name is required.");
        Optional<BorrowingProduct> byName = this.borrowingProductService.findByName(borrowingProductDto.getName());
        if (byName.isPresent()) {
            Assert.isTrue(byName.get().getId().equals(borrowingProductDto.getId()), "Name is taken.");
        }
        this.stringIsNotEmpty(borrowingProductDto.getCode(), "Code is required.");
        Optional<BorrowingProduct> byCode = this.borrowingProductService.findByCode(borrowingProductDto.getCode());
        if (byCode.isPresent()) {
            Assert.isTrue(byCode.get().getId().equals(borrowingProductDto.getId()), "Code is taken.");
        }
        this.validate(borrowingProductDto);
    }

    public void validate(BorrowingProductDto borrowingProductDto) {
        Assert.notNull(borrowingProductDto.getCurrencyId(), "Currency is required.");
        Assert.isTrue(this.currencyService.findOne(borrowingProductDto.getCurrencyId()).isPresent(), "Invalid currency.");

        for (Map.Entry<BorrowingRuleType,Long> entry : borrowingProductDto.getAccountList().entrySet()) {
            Account account = this.accountService.findOne(entry.getValue()).get();
            Currency accountCurrency = account.getCurrency();
            if (accountCurrency != null) {
                if (!accountCurrency.getId().equals(borrowingProductDto.getCurrencyId())) {
                    throw new RuntimeException("Product currency and accounts currencies should be the same");
                }
            }
        }

        this.stringIsNotEmpty(borrowingProductDto.getScheduleType(), "Schedule type is required.");

        Assert.notNull(borrowingProductDto.getInterestRateMin(), "Minimum interest rate is required.");
        Assert.isTrue(
                borrowingProductDto
                        .getInterestRateMin()
                        .doubleValue() >= 0,
                "Minimum interest rate should be greater than zero.");

        Assert.isTrue(
                borrowingProductDto
                        .getInterestRateMin()
                        .precision()
                        - borrowingProductDto
                        .getInterestRateMin()
                        .scale() <= 4,
                "Minimum interest rate should be less than 10000.");

        Assert.notNull(
                borrowingProductDto.getInterestRateMax(),
                "Maximum interest rate is required.");
        Assert.isTrue(
                borrowingProductDto
                        .getInterestRateMax()
                        .doubleValue() > 0,
                "Maximum interest rate should be greater than zero.");

        Assert.isTrue(
                (borrowingProductDto
                        .getInterestRateMax()
                        .precision()
                        - borrowingProductDto
                        .getInterestRateMax()
                        .scale()) <= 4,
                "Maximum interest rate should be less than 10000.");
        Assert.isTrue(
                borrowingProductDto
                        .getInterestRateMin()
                        .doubleValue()
                        <= borrowingProductDto
                        .getInterestRateMax()
                        .doubleValue(),
                "Minimum interest rate should be less than or equal to the maximum value.");

        Assert.notNull(borrowingProductDto.getAmountMin(), "Minimum amount is required.");
        Assert.isTrue(
                borrowingProductDto.getAmountMin().doubleValue() > 0,
                "Minimum amount should be greater than zero.");

        Assert.notNull(
                borrowingProductDto.getAmountMax(),
                "Maximum value of amount is required.");
        Assert.isTrue(
                borrowingProductDto.getAmountMax().doubleValue() > 0,
                "Maximum value of amount should be greater than zero.");

        Assert.isTrue(
                borrowingProductDto.getAmountMin().doubleValue()
                        <= borrowingProductDto.getAmountMax().doubleValue(),
                "Minimum amount should be less than or equal to the maximum value.");

        Assert.notNull(
                borrowingProductDto.getMaturityMin(),
                "Minimum maturity is required.");
        Assert.isTrue(
                borrowingProductDto.getMaturityMin() > 0,
                "Minimum maturity should be greater than zero.");

        Assert.notNull(
                borrowingProductDto.getMaturityMax(),
                "Maximum maturity is required.");

        Assert.isTrue(
                borrowingProductDto.getMaturityMax() > 0,
                "Maximum maturity should be greater than zero.");

        Assert.isTrue(
                borrowingProductDto.getMaturityMin()
                        <= borrowingProductDto.getMaturityMax(),
                "Minimum maturity should be less than or equal to the maximum value.");

        Assert.notNull(
                borrowingProductDto.getGracePeriodMin(),
                "Minimum grace period is required.");

        Assert.notNull(
                borrowingProductDto.getGracePeriodMax(),
                "Maximum grace period is required.");
        Assert.isTrue(
                borrowingProductDto.getGracePeriodMin()
                        <= borrowingProductDto.getGracePeriodMax(),
                "Minimum grace period should be less than or equal to the maximum value.");
    }
}
