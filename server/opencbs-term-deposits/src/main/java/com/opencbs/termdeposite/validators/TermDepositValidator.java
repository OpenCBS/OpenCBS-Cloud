package com.opencbs.termdeposite.validators;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.ProfileService;
import com.opencbs.core.services.UserService;
import com.opencbs.core.validators.BaseValidator;
import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.domain.TermDepositProduct;
import com.opencbs.termdeposite.dto.TermDepositDto;
import com.opencbs.termdeposite.services.TermDepositProductsService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Validator
public class TermDepositValidator extends BaseValidator {

    private final TermDepositProductsService termDepositProductsService;
    private final ProfileService profileService;
    private final UserService userService;


    @Autowired
    public TermDepositValidator(TermDepositProductsService termDepositProductsService,
                           ProfileService profileService,
                           UserService userService) {
        this.termDepositProductsService = termDepositProductsService;
        this.profileService = profileService;
        this.userService = userService;
    }

    public void validate(TermDepositDto termDepositDto) {
        TermDepositProduct product = validateTermDepositProduct(termDepositDto);

        Assert.notNull(termDepositDto.getServiceOfficerId(), "Saving officer is required.");
        Assert.isTrue(this.userService.findById(termDepositDto.getServiceOfficerId()).isPresent(), String.format("User is not found(ID=%d).", termDepositDto.getServiceOfficerId()));

        Assert.notNull(termDepositDto.getProfileId(), "Profile is required.");
        Optional<Profile> profile = this.profileService.findOne(termDepositDto.getProfileId());
        Assert.isTrue(profile.isPresent(), String.format("Profile is not found(ID=%d).", termDepositDto.getProfileId()));

        Assert.isTrue(DateHelper.lessOrEqual(termDepositDto.getCreatedDate().toLocalDate(), DateHelper.getLocalDateNow()), "Term Deposit cannot be opened by future date");

        Currency currencyProduct = product.getCurrency();
        List<Currency> currencies = profile.get().getCurrentAccounts()
                .stream()
                .map(Account::getCurrency)
                .collect(Collectors.toList());

        Assert.isTrue(currencies.contains(currencyProduct), String.format("Current accounts don't have this currency %s", currencyProduct.getName()));

        this.validateBigDecimalField(termDepositDto.getInterestRate(), product.getInterestRateMin(), product.getInterestRateMax(), "Interest Rate");
        this.validateBigDecimalField(termDepositDto.getTermAgreement(), product.getTermAgreementMin(), product.getTermAgreementMax(), "Maturity");
    }

    private TermDepositProduct validateTermDepositProduct(TermDepositDto termDepositDto) {
        Assert.notNull(termDepositDto.getTermDepositProductId(), "Term Deposit product is required.");
        Optional<TermDepositProduct> termDepositProduct = this.termDepositProductsService.getOne(termDepositDto.getTermDepositProductId());
        Assert.isTrue(termDepositProduct.isPresent(), String.format("Term Deposit product is not found(Id=%d).", termDepositDto.getTermDepositProductId()));
        return termDepositProduct.get();
    }

    public void validateOnUpdate(TermDepositDto termDepositDto) {
        this.validate(termDepositDto);
    }

    public void validateOnOpen(@NonNull BigDecimal amount, @NonNull TermDeposit termDeposit, @NonNull LocalDate openDate) {
        Assert.isTrue(DateHelper.lessOrEqual(openDate, LocalDate.now()), "Term Deposit cannot be opened by future date");
        Assert.isTrue(DateHelper.lessOrEqual(termDeposit.getCreatedAt().toLocalDate(), openDate), "Open date must be equal or greater than created at");
        TermDepositProduct termDepositProduct = termDeposit.getTermDepositProduct();
        Assert.notNull(termDepositProduct, "Term Deposit product is required.");

        this.validateBigDecimalField(amount, termDepositProduct.getAmountMin(), termDepositProduct.getAmountMax(), "Initial amount");
    }

    private void validateBigDecimalField(BigDecimal value, BigDecimal start, BigDecimal end, String fieldName) {
        if (start == null || end == null) {
            return;
        }
        Assert.notNull(value, String.format("%s is required.", fieldName));
        this.assertIsBetween(value, start, end, fieldName);
    }

    private void assertIsBetween(BigDecimal value, BigDecimal start, BigDecimal end, String fieldName) {
        Assert.isTrue(this.isBetween(value, start, end),
                String.format("%s should be between %s and %s.", fieldName, start.doubleValue(), end.doubleValue()));
    }

    private boolean isBetween(BigDecimal value, BigDecimal start, BigDecimal end) {
        return value.compareTo(start) >= 0 && value.compareTo(end) <= 0; //TODO make null safety
    }
}
