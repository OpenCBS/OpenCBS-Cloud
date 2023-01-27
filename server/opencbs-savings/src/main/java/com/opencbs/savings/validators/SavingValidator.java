package com.opencbs.savings.validators;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.ProfileService;
import com.opencbs.core.services.UserService;
import com.opencbs.core.validators.BaseValidator;
import com.opencbs.savings.domain.Saving;
import com.opencbs.savings.domain.SavingProduct;
import com.opencbs.savings.dto.SavingDto;
import com.opencbs.savings.services.SavingProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Validator
public class SavingValidator extends BaseValidator {

    private final SavingProductService savingProductService;
    private final ProfileService profileService;
    private final UserService userService;

    @Autowired
    public SavingValidator(SavingProductService savingProductService,
                           ProfileService profileService,
                           UserService userService) {
        this.savingProductService = savingProductService;
        this.profileService = profileService;
        this.userService = userService;
    }

    public void validate(SavingDto dto) {
        Assert.notNull(dto.getSavingProductId(), "Saving product is required.");
        Optional<SavingProduct> savingProduct = this.savingProductService.getOne(dto.getSavingProductId());
        Assert.isTrue(savingProduct.isPresent(), String.format("Saving product is not found(Id=%d).", dto.getSavingProductId()));
        SavingProduct product = savingProduct.get();

        Assert.notNull(dto.getSavingOfficerId(), "Saving officer is required.");
        Assert.isTrue(this.userService.findById(dto.getSavingOfficerId()).isPresent(), String.format("User is not found(ID=%d).", dto.getSavingOfficerId()));

        Assert.notNull(dto.getProfileId(), "Profile is required.");
        Optional<Profile> profile = this.profileService.findOne(dto.getProfileId());
        Assert.isTrue(profile.isPresent(), String.format("Profile is not found(ID=%d).", dto.getProfileId()));

        Assert.isTrue(DateHelper.lessOrEqual(dto.getOpenDate().toLocalDate(), DateHelper.getLocalDateNow()), "Saving cannot be opened by future date");

        Currency currencyProduct = product.getCurrency();
        List<Currency> currencies = profile.get().getCurrentAccounts()
                .stream()
                .map(Account::getCurrency)
                .collect(Collectors.toList());

        Assert.isTrue(currencies.contains(currencyProduct), String.format("Current accounts don't have this currency %s", currencyProduct.getName()));

        this.validateBigDecimalField(dto.getInterestRate(), product.getInterestRateMin(), product.getInterestRateMax(), "Interest Rate");
        this.validateBigDecimalField(dto.getDepositFeeRate(), product.getDepositFeeRateMin(), product.getDepositFeeRateMax(), "Deposit fee rate");
        this.validateBigDecimalField(dto.getDepositFeeFlat(), product.getDepositFeeFlatMin(), product.getDepositFeeFlatMax(), "Deposit fee flat");
        this.validateBigDecimalField(dto.getWithdrawalFeeRate(), product.getWithdrawalFeeRateMin(), product.getWithdrawalFeeRateMax(), "Withdrawal fee rate");
        this.validateBigDecimalField(dto.getWithdrawalFeeFlat(), product.getWithdrawalFeeFlatMin(), product.getWithdrawalFeeFlatMax(), "Withdrawal fee flat");
        this.validateBigDecimalField(dto.getEntryFeeRate(), product.getEntryFeeRateMin(), product.getEntryFeeRateMax(), "Entry fee rate");
        this.validateBigDecimalField(dto.getEntryFeeFlat(), product.getEntryFeeFlatMin(), product.getEntryFeeFlatMax(), "Entry fee flat");
        this.validateBigDecimalField(dto.getCloseFeeRate(), product.getCloseFeeRateMin(), product.getCloseFeeRateMax(), "Close fee rate");
        this.validateBigDecimalField(dto.getCloseFeeFlat(), product.getCloseFeeFlatMin(), product.getCloseFeeFlatMax(), "Close fee flat");
        this.validateBigDecimalField(dto.getManagementFeeRate(), product.getManagementFeeRateMin(), product.getManagementFeeRateMax(), "Management fee rate");
        this.validateBigDecimalField(dto.getManagementFeeFlat(), product.getManagementFeeFlatMin(), product.getManagementFeeFlatMax(), "Management fee flat");
    }

    public void validateOnOpen(BigDecimal amount, SavingProduct savingProduct) {
        this.validateBigDecimalField(amount, savingProduct.getInitialAmountMin(), savingProduct.getInitialAmountMax(), "Initial amount");
    }

    public void validateOnDate(LocalDateTime savingOpenDate, LocalDateTime date) {
        Assert.isTrue(savingOpenDate.isBefore(date), "Operation date must be greater than saving open date");
    }

    public void validateDepositAmount(BigDecimal amount, Saving saving) {
        this.validateBigDecimalField(amount, saving.getDepositAmountMin(), saving.getDepositAmountMax(), "Deposit amount");
    }

    public void validateWithdrawAmount(BigDecimal amount, Saving saving) {
        this.validateBigDecimalField(amount, saving.getWithdrawalAmountMin(), saving.getWithdrawalAmountMax(), "Withdraw amount");
    }

    private boolean isBetween(BigDecimal value, BigDecimal start, BigDecimal end) {
        return value.compareTo(start) >= 0 && value.compareTo(end) <= 0; //TODO make null safety
    }

    private void assertIsBetween(BigDecimal value, BigDecimal start, BigDecimal end, String fieldName) {
        Assert.isTrue(this.isBetween(value, start, end),
                String.format("%s should be between %s and %s.", fieldName, start.doubleValue(), end.doubleValue()));
    }

    private void validateBigDecimalField(BigDecimal value, BigDecimal start, BigDecimal end, String fieldName) {
        if (start == null || end == null) {
            return;
        }
        Assert.notNull(value, String.format("%s is required.", fieldName));
        this.assertIsBetween(value, start, end, fieldName);
    }
}
