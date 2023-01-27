package com.opencbs.savings.validators;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.validators.BaseValidator;
import com.opencbs.savings.domain.SavingProduct;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import com.opencbs.savings.dto.SavingAccountDto;
import com.opencbs.savings.dto.SavingProductDto;
import com.opencbs.savings.services.SavingProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Validator
public class SavingProductValidator extends BaseValidator {

    private final SavingProductService savingProductService;
    private final CurrencyService currencyService;
    private final AccountService accountService;

    @Autowired
    public SavingProductValidator(SavingProductService savingProductService,
                                  CurrencyService currencyService,
                                  AccountService accountService) {
        this.savingProductService = savingProductService;
        this.currencyService = currencyService;
        this.accountService = accountService;
    }

    public void validateOnCreate(SavingProductDto savingProductDto) {
        this.stringIsNotEmpty(savingProductDto.getName(), "Name is required.");
        Assert.isTrue(!this.savingProductService.findByName(savingProductDto.getName()).isPresent(), "Name is taken.");

        this.stringIsNotEmpty(savingProductDto.getCode(), "Code is required.");
        Assert.isTrue(!this.savingProductService.findByCode(savingProductDto.getCode()).isPresent(), "Code is taken.");

        this.validate(savingProductDto);
    }

    public void validateOnUpdate(SavingProductDto savingProductDto, Long id) {
        this.stringIsNotEmpty(savingProductDto.getName(), "Name is required.");
        Optional<SavingProduct> byName = this.savingProductService.findByName(savingProductDto.getName());
        if (byName.isPresent()) {
            Assert.isTrue(byName.get().getId().equals(savingProductDto.getId()), "Name is taken.");
        }

        this.stringIsNotEmpty(savingProductDto.getCode(), "Code is required.");
        Optional<SavingProduct> byCode = this.savingProductService.findByCode(savingProductDto.getCode());
        if (byCode.isPresent()) {
            Assert.isTrue(byCode.get().getId().equals(savingProductDto.getId()), "Code is taken.");
        }

        this.validate(savingProductDto);
    }

    private void validate(SavingProductDto savingProductDto) {
        this.generalValidate(savingProductDto);
        this.depositValidate(savingProductDto);
        this.withdrawalValidate(savingProductDto);
        this.managementValidate(savingProductDto);
        this.entryValidate(savingProductDto);
        this.closeValidate(savingProductDto);
        this.accountsValidate(savingProductDto);
    }

    private void generalValidate(SavingProductDto savingProductDto) {
        Assert.notNull(savingProductDto.getAvailability(), "Availability is required");
        Assert.notNull(savingProductDto.getCurrencyId(), "Currency id is required.");

        Assert.isTrue(this.currencyService.findOne(savingProductDto.getCurrencyId()).isPresent(),
                String.format("Invalid currency with id = %d.", savingProductDto.getCurrencyId()));

        for (Map.Entry<SavingAccountRuleType,Long> entry : savingProductDto.getAccounts().entrySet()) {
            Account account = this.accountService.findOne(entry.getValue()).get();
            Currency accountCurrency = account.getCurrency();
            if (accountCurrency != null) {
                if (!accountCurrency.getId().equals(savingProductDto.getCurrencyId())) {
                    throw new RuntimeException("Product currency and accounts currencies should be the same");
                }
            }
        }

        Assert.notNull(savingProductDto.getInitialAmountMin(), "Minimum initial amount is required.");
        Assert.notNull(savingProductDto.getInitialAmountMax(), "Maximum initial amount is required.");
        Assert.notNull(savingProductDto.getInterestRateMin(), "Minimum interest rate is required.");
        Assert.notNull(savingProductDto.getInterestRateMax(), "Maximum interest rate is required.");
        Assert.notNull(savingProductDto.getInterestAccrualFrequency(), "Interest accrual frequency is required.");
        Assert.notNull(savingProductDto.getPostingFrequency(), "Posting frequency is required.");

        Assert.isTrue(savingProductDto.getInitialAmountMin().doubleValue() >= 0,
                "Minimum initial amount can't be less then zero.");

        Assert.isTrue(savingProductDto.getInitialAmountMax().doubleValue() >= 0,
                "Maximum initial amount can't be less then zero.");

        Assert.isTrue(savingProductDto.getInterestRateMin().doubleValue() >= 0,
                "Minimum interest rate can't be less then zero.");

        Assert.isTrue(savingProductDto.getInterestRateMax().doubleValue() >= 0,
                "Maximum interest rate can't be less then zero.");

        Assert.isTrue(savingProductDto.getInitialAmountMin().doubleValue() <= savingProductDto.getInitialAmountMax().doubleValue(),
                "Minimum initial amount should be less than or equal to the maximum value.");

        Assert.isTrue(savingProductDto.getInterestRateMin().doubleValue() <= savingProductDto.getInterestRateMax().doubleValue(),
                "Minimum interest rate should be less than or equal to the maximum value.");
    }

    private void depositValidate(SavingProductDto savingProductDto) {
        Assert.notNull(savingProductDto.getDepositAmountMin(), "Minimum deposit amount is required.");
        Assert.notNull(savingProductDto.getDepositAmountMax(), "Maximum deposit amount is required.");

        Assert.isTrue(savingProductDto.getDepositAmountMin().doubleValue() >= 0,
                "Minimum deposit amount should can't be less then zero.");

        Assert.isTrue(savingProductDto.getDepositAmountMax().doubleValue() > 0,
                "Maximum deposit amount should be greater than zero.");

        Assert.isTrue(savingProductDto.getDepositAmountMin().doubleValue() <= savingProductDto.getDepositAmountMax().doubleValue(),
                "Minimum deposit amount should be less than or equal to the maximum value.");

        if (savingProductDto.getDepositFeeRateMin() != null) {
            Assert.notNull(savingProductDto.getDepositFeeRateMax(), "Maximum deposit fee rate is required.");

            Assert.isTrue(savingProductDto.getDepositFeeRateMin().doubleValue() >= 0,
                    "Minimum deposit fee rate should can't be less then zero.");

            Assert.isTrue(savingProductDto.getDepositFeeRateMin().doubleValue() <= savingProductDto.getDepositFeeRateMax().doubleValue(),
                    "Minimum deposit fee rate should be less than or equal to the maximum value.");
        }

        if (savingProductDto.getDepositFeeRateMax() != null) {
            Assert.notNull(savingProductDto.getDepositFeeRateMin(), "Minimum deposit fee rate is required.");

            Assert.isTrue(savingProductDto.getDepositFeeRateMax().doubleValue() >= 0,
                    "Maximum deposit fee rate can't be less then zero.");
        }

        if (savingProductDto.getDepositFeeFlatMin() != null) {
            Assert.notNull(savingProductDto.getDepositFeeFlatMax(), "Maximum deposit fee flat rate is required.");

            Assert.isTrue(savingProductDto.getDepositFeeFlatMin().doubleValue() >= 0,
                    "Minimum deposit fee flat rate can't be less then zero.");

            Assert.isTrue(savingProductDto.getDepositFeeFlatMin().doubleValue() <= savingProductDto.getDepositFeeFlatMax().doubleValue(),
                    "Minimum deposit fee flat rate should be less than or equal to the maximum value.");
        }

        if (savingProductDto.getDepositFeeFlatMax() != null) {
            Assert.notNull(savingProductDto.getDepositFeeFlatMin(), "Minimum deposit fee flat rate is required.");

            Assert.isTrue(savingProductDto.getDepositFeeFlatMax().doubleValue() >= 0,
                    "Maximum deposit fee flat rate can't be less then zero.");
        }
    }

    private void withdrawalValidate(SavingProductDto savingProductDto) {
        Assert.notNull(savingProductDto.getWithdrawalAmountMin(), "Minimum withdrawal amount is required.");
        Assert.notNull(savingProductDto.getWithdrawalAmountMax(), "Maximum withdrawal amount is required.");

        Assert.isTrue(savingProductDto.getWithdrawalAmountMin().doubleValue() > 0,
                "Minimum withdrawal amount should be greater than zero.");

        Assert.isTrue(savingProductDto.getWithdrawalAmountMax().doubleValue() >= 0,
                "Maximum withdrawal amount should can't be less then zero.");

        if (savingProductDto.getWithdrawalFeeRateMin() != null) {
            Assert.notNull(savingProductDto.getWithdrawalFeeRateMax(), "Maximum withdrawal fee rate is required.");

            Assert.isTrue(savingProductDto.getWithdrawalFeeRateMin().doubleValue() >= 0,
                    "Minimum withdrawal fee rate can't be less then zero.");

            Assert.isTrue(savingProductDto.getWithdrawalFeeRateMin().doubleValue() <= savingProductDto.getWithdrawalFeeRateMax().doubleValue(),
                    "Minimum withdrawal fee rate should be less than or equal to the maximum value.");
        }

        if (savingProductDto.getWithdrawalFeeRateMax() != null) {
            Assert.notNull(savingProductDto.getWithdrawalFeeRateMin(), "Minimum withdrawal fee rate is required.");

            Assert.isTrue(savingProductDto.getWithdrawalFeeRateMax().doubleValue() >= 0,
                    "Maximum withdrawal fee rate can't be less then zero.");
        }

        if (savingProductDto.getWithdrawalFeeFlatMin() != null) {
            Assert.notNull(savingProductDto.getWithdrawalFeeFlatMax(), "Maximum withdrawal fee flat rate is required.");

            Assert.isTrue(savingProductDto.getWithdrawalFeeFlatMin().doubleValue() >= 0,
                    "Minimum withdrawal fee flat rate can't be less then zero.");

            Assert.isTrue(savingProductDto.getWithdrawalFeeFlatMin().doubleValue() <= savingProductDto.getWithdrawalFeeFlatMax().doubleValue(),
                    "Minimum withdrawal fee flat rate should be less than or equal to the maximum value.");
        }

        if (savingProductDto.getWithdrawalFeeFlatMax() != null) {
            Assert.notNull(savingProductDto.getWithdrawalFeeFlatMin(), "Minimum withdrawal fee flat rate is required.");

            Assert.isTrue(savingProductDto.getWithdrawalFeeFlatMax().doubleValue() >= 0,
                    "Maximum withdrawal fee flat rate can't be less then zero.");
        }

        Assert.isTrue(savingProductDto.getWithdrawalAmountMin().doubleValue() <= savingProductDto.getWithdrawalAmountMax().doubleValue(),
                "Minimum withdrawal amount should be less than or equal to the maximum value.");
    }

    private void managementValidate(SavingProductDto savingProductDto) {
        if (savingProductDto.getManagementFeeRateMin() != null) {
            Assert.notNull(savingProductDto.getManagementFeeRateMax(), "Maximum management fee rate is required.");

            Assert.isTrue(savingProductDto.getManagementFeeRateMin().doubleValue() >= 0,
                    "Minimum management fee rate should be greater than zero.");

            Assert.isTrue(savingProductDto.getManagementFeeRateMin().doubleValue() <= savingProductDto.getManagementFeeRateMax().doubleValue(),
                    "Minimum management fee rate should be less than or equal to the maximum value.");
        }

        if (savingProductDto.getManagementFeeRateMax() != null) {
            Assert.notNull(savingProductDto.getManagementFeeRateMin(), "Minimum management fee rate is required.");

            Assert.isTrue(savingProductDto.getManagementFeeRateMax().doubleValue() >= 0,
                    "Maximum management fee rate can't be less then zero.");
        }

        if (savingProductDto.getManagementFeeFlatMin() != null) {
            Assert.notNull(savingProductDto.getManagementFeeFlatMax(), "Maximum management fee flat rate is required.");

            Assert.isTrue(savingProductDto.getManagementFeeFlatMin().doubleValue() >= 0,
                    "Minimum management fee flat rate should be greater than zero.");

            Assert.isTrue(savingProductDto.getManagementFeeFlatMin().doubleValue() <= savingProductDto.getManagementFeeFlatMax().doubleValue(),
                    "Minimum management fee flat rate should be less than or equal to the maximum value.");
        }

        if (savingProductDto.getManagementFeeFlatMax() != null) {
            Assert.notNull(savingProductDto.getManagementFeeFlatMin(), "Minimum management fee flat rate is required.");

            Assert.isTrue(savingProductDto.getManagementFeeFlatMax().doubleValue() >= 0,
                    "Maximum management fee flat rate can't be less then zero.");
        }

        Assert.notNull(savingProductDto.getManagementFeeFrequency(), "Management fee frequency is required.");
    }

    private void entryValidate(SavingProductDto savingProductDto) {
        if (savingProductDto.getEntryFeeRateMin() != null) {
            Assert.notNull(savingProductDto.getEntryFeeRateMax(), "Maximum entry fee rate is required.");

            Assert.isTrue(savingProductDto.getEntryFeeRateMin().doubleValue() >= 0,
                    "Minimum entry fee rate can't be less then zero.");

            Assert.isTrue(savingProductDto.getEntryFeeRateMin().doubleValue() <= savingProductDto.getEntryFeeRateMax().doubleValue(),
                    "Minimum entry fee rate should be less than or equal to the maximum value.");
        }

        if (savingProductDto.getEntryFeeRateMax() != null) {
            Assert.notNull(savingProductDto.getEntryFeeRateMin(), "Minimum entry fee rate is required.");

            Assert.isTrue(savingProductDto.getEntryFeeRateMax().doubleValue() >= 0,
                    "Maximum entry fee rate can't be less then zero.");
        }

        if (savingProductDto.getEntryFeeFlatMin() != null) {
            Assert.notNull(savingProductDto.getEntryFeeRateMax(), "Maximum entry fee flat rate is required.");

            Assert.isTrue(savingProductDto.getEntryFeeFlatMin().doubleValue() >= 0,
                    "Minimum entry fee flat can't be less then zero.");

            Assert.isTrue(savingProductDto.getEntryFeeFlatMin().doubleValue()
                            <= savingProductDto.getEntryFeeFlatMax().doubleValue(),
                    "Minimum entry fee flat rate should be less than or equal to the maximum value.");
        }

        if (savingProductDto.getWithdrawalFeeFlatMax() != null) {
            Assert.notNull(savingProductDto.getEntryFeeFlatMin(), "Minimum entry fee flat rate is required.");

            Assert.isTrue(savingProductDto.getEntryFeeFlatMax().doubleValue() >= 0,
                    "Maximum entry fee flat rate can't be less then zero.");
        }
    }

    private void closeValidate(SavingProductDto savingProductDto) {
        if (savingProductDto.getCloseFeeRateMin() != null) {
            Assert.notNull(savingProductDto.getCloseFeeRateMax(), "Maximum close fee rate is required.");

            Assert.isTrue(savingProductDto.getCloseFeeRateMin().doubleValue() >= 0,
                    "Minimum close fee rate can't be less then zero.");

            Assert.isTrue(savingProductDto.getCloseFeeRateMin().doubleValue() <= savingProductDto.getCloseFeeRateMax().doubleValue(),
                    "Minimum close fee rate should be less than or equal to the maximum value.");
        }

        if (savingProductDto.getCloseFeeRateMax() != null) {
            Assert.notNull(savingProductDto.getCloseFeeRateMin(), "Minimum close fee rate is required.");

            Assert.isTrue(savingProductDto.getCloseFeeRateMax().doubleValue() >= 0,
                    "Maximum close fee rate can't be less then zero.");
        }

        if (savingProductDto.getCloseFeeFlatMin() != null) {
            Assert.notNull(savingProductDto.getCloseFeeFlatMax(), "Maximum close fee flat rate is required.");

            Assert.isTrue(savingProductDto.getCloseFeeFlatMin().doubleValue() >= 0,
                    "Minimum close fee flat rate can't be less then zero.");

            Assert.isTrue(savingProductDto.getCloseFeeFlatMin().doubleValue() <= savingProductDto.getCloseFeeFlatMax().doubleValue(),
                    "Minimum close fee flat rate should be less than or equal to the maximum value.");
        }

        if (savingProductDto.getCloseFeeFlatMax() != null) {
            Assert.notNull(savingProductDto.getCloseFeeFlatMin(), "Minimum close fee flat rate is required.");

            Assert.isTrue(savingProductDto.getCloseFeeFlatMax().doubleValue() >= 0,
                    "Maximum close fee flat rate can't be less then zero.");
        }
    }

    private void accountsValidate(SavingProductDto savingProductDto) {
        SavingAccountDto accountsFromDto = savingProductDto.getAccounts();
        Assert.notNull(accountsFromDto, "Saving products accounts is required.");

        Long accountId;
        for (SavingAccountRuleType type : SavingAccountRuleType.values()) {
            Assert.isTrue(accountsFromDto.containsKey(type), String.format("%s account type is required.", type));
            accountId = accountsFromDto.get(type);
            Assert.notNull(accountId, String.format("%s account id is required.", type));
        }

        this.accountExistAndTypeValidate(accountsFromDto);
    }

    private void accountExistAndTypeValidate(SavingAccountDto accountsFromDto) {
        Map<Long, Account> accounts = this.accountService.findByIds(new HashSet<>(accountsFromDto.values()))
                .stream()
                .collect(Collectors.toMap(BaseEntity::getId, x -> x, (a, b) -> b, HashMap::new));

        AccountType type;
        for (Map.Entry<SavingAccountRuleType, Long> entry : accountsFromDto.entrySet()) {
            Assert.isTrue(accounts.keySet().contains(entry.getValue()),
                    String.format("%s account not found (ID=%d)", entry.getKey(), entry.getValue()));

            type = accounts.get(entry.getValue()).getType();
            Assert.isTrue(type.equals(AccountType.BALANCE) || type.equals(AccountType.SUBGROUP),
                    String.format("%s account is type %s. Account must have type BALANCE or SUBGROUP.", entry.getKey(), type));
        }
    }
}