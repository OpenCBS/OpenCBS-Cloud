package com.opencbs.termdeposite.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.validators.BaseValidator;
import com.opencbs.termdeposite.domain.enums.TermDepositAccountType;
import com.opencbs.termdeposite.domain.TermDepositProduct;
import com.opencbs.termdeposite.dto.TermDepositProductAccountDto;
import com.opencbs.termdeposite.dto.TermDepositProductDto;
import com.opencbs.termdeposite.services.TermDepositProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Validator
public class TermDepositProductValidator extends BaseValidator {

    private final TermDepositProductsService termDepositProductsService;
    private final CurrencyService currencyService;
    private final AccountService accountService;

    @Autowired
    public TermDepositProductValidator(TermDepositProductsService termDepositProductsService,
                                       CurrencyService currencyService,
                                       AccountService accountService) {
        this.termDepositProductsService = termDepositProductsService;
        this.currencyService = currencyService;
        this.accountService = accountService;
    }

    public void validateOnCreate(TermDepositProductDto termDepositProductDto) {
        this.stringIsNotEmpty(termDepositProductDto.getName(), "Name is required.");
        Assert.isTrue(!this.termDepositProductsService.findByName(termDepositProductDto.getName()).isPresent(), "Name is taken.");

        this.stringIsNotEmpty(termDepositProductDto.getCode(), "Code is required.");
        Assert.isTrue(!this.termDepositProductsService.findByCode(termDepositProductDto.getCode()).isPresent(), "Code is taken.");

        this.validate(termDepositProductDto);
    }

    public void validateOnUpdate(TermDepositProductDto termDepositProductDto) {
        this.stringIsNotEmpty(termDepositProductDto.getName(), "Name is required.");
        Optional<TermDepositProduct> byName = this.termDepositProductsService.findByName(termDepositProductDto.getName());
        if (byName.isPresent()) {
            Assert.isTrue(byName.get().getId().equals(termDepositProductDto.getId()), "Name is taken.");
        }

        this.stringIsNotEmpty(termDepositProductDto.getCode(), "Code is required.");
        Optional<TermDepositProduct> byCode = this.termDepositProductsService.findByCode(termDepositProductDto.getCode());
        if (byCode.isPresent()) {
            Assert.isTrue(byCode.get().getId().equals(termDepositProductDto.getId()), "Code is taken.");
        }

        this.validate(termDepositProductDto);
    }

    private void validate(TermDepositProductDto termDepositProductDto) {
        this.generalValidate(termDepositProductDto);
        this.accountsValidate(termDepositProductDto);
    }

    private void generalValidate(TermDepositProductDto termDepositProductDto) {
        Assert.notNull(termDepositProductDto.getAvailability(), "Availability is required");
        Assert.notNull(termDepositProductDto.getCurrencyId(), "Currency id is required.");

        Assert.isTrue(this.currencyService.findOne(termDepositProductDto.getCurrencyId()).isPresent(),
                String.format("Invalid currency with id = %d.", termDepositProductDto.getCurrencyId()));

        for (Map.Entry<TermDepositAccountType,Long> entry : termDepositProductDto.getAccountList().entrySet()) {
            Account account = this.accountService.findOne(entry.getValue()).orElseThrow(() -> new ResourceNotFoundException(
                    String.format("Account not found (ID=%d).", entry.getValue())));
            Currency accountCurrency = account.getCurrency();
            if (accountCurrency != null) {
                if (!accountCurrency.getId().equals(termDepositProductDto.getCurrencyId())) {
                    throw new RuntimeException("Product currency and accounts currencies should be the same");
                }
            }
        }

        Assert.notNull(termDepositProductDto.getAmountMin(), "Minimum initial amount is required.");
        Assert.notNull(termDepositProductDto.getAmountMax(), "Maximum initial amount is required.");
        Assert.notNull(termDepositProductDto.getInterestRateMin(), "Minimum interest rate is required.");
        Assert.notNull(termDepositProductDto.getInterestRateMax(), "Maximum interest rate is required.");
        Assert.notNull(termDepositProductDto.getInterestAccrualFrequency(), "Interest accrual frequency is required.");
        Assert.notNull(termDepositProductDto.getEarlyCloseFeeFlatMin(), "Minimum early close fee flat is required.");
        Assert.notNull(termDepositProductDto.getEarlyCloseFeeFlatMax(), "Maximum early close fee flat is required.");
        Assert.notNull(termDepositProductDto.getEarlyCloseFeeRateMin(), "Minimum early close fee rate is required.");
        Assert.notNull(termDepositProductDto.getEarlyCloseFeeRateMax(), "Maximum early close fee rate is required.");

        Assert.isTrue(termDepositProductDto.getAmountMin().doubleValue() > 0,
                "Minimum initial amount should be greater than zero.");

        Assert.isTrue(termDepositProductDto.getAmountMax().doubleValue() > 0,
                "Maximum initial amount should be greater than zero.");

        Assert.isTrue(termDepositProductDto.getInterestRateMin().doubleValue() >= 0,
                "Minimum interest rate should be greater than zero.");

        Assert.isTrue(termDepositProductDto.getInterestRateMax().doubleValue() > 0,
                "Maximum interest rate should be greater than zero.");

        Assert.isTrue(termDepositProductDto.getEarlyCloseFeeFlatMin().doubleValue() >= 0,
                "Minimum early close fee flat should be greater or equal to zero.");

        Assert.isTrue(termDepositProductDto.getEarlyCloseFeeFlatMax().doubleValue() >= 0,
                "Maximum early close fee flat should be greater or equal to zero.");

        Assert.isTrue(termDepositProductDto.getEarlyCloseFeeRateMin().doubleValue() >= 0,
                "Minimum early close fee rate should be greater or equal to zero.");

        Assert.isTrue(termDepositProductDto.getEarlyCloseFeeRateMax().doubleValue() >= 0,
                "Maximum early close fee rate should be greater or equal to zero.");

        Assert.isTrue(termDepositProductDto.getAmountMin().doubleValue() <= termDepositProductDto.getAmountMax().doubleValue(),
                "Minimum initial amount should be less than or equal to the maximum value.");

        Assert.isTrue(termDepositProductDto.getInterestRateMin().doubleValue() <= termDepositProductDto.getInterestRateMax().doubleValue(),
                "Minimum interest rate should be less than or equal to the maximum value.");

        Assert.isTrue(termDepositProductDto.getTermAgreementMin().doubleValue() <= termDepositProductDto.getTermAgreementMax().doubleValue(),
                "Minimum term agreement should be less than or equal to the maximum value.");

        Assert.isTrue(termDepositProductDto.getEarlyCloseFeeFlatMin().doubleValue() <= termDepositProductDto.getEarlyCloseFeeFlatMax().doubleValue(),
                "Early close fee flat should be less than or equal to the maximum value.");

        Assert.isTrue(termDepositProductDto.getEarlyCloseFeeRateMin().doubleValue() <= termDepositProductDto.getEarlyCloseFeeRateMax().doubleValue(),
                "Early close fee rate should be less than or equal to the maximum value.");
    }

    private void accountsValidate(TermDepositProductDto termDepositProductDto) {
        TermDepositProductAccountDto accounts = termDepositProductDto.getAccountList();
        Assert.notNull(accounts, "Term Deposit products accounts is required.");

        Long accountId;
        for (TermDepositAccountType type : TermDepositAccountType.values()) {
            Assert.isTrue(accounts.containsKey(type), String.format("%s account type is required.", type));
            accountId = accounts.get(type);
            Assert.notNull(accountId, String.format("%s account id is required.", type));
        }

        this.accountExistAndTypeValidate(accounts);
    }

    private void accountExistAndTypeValidate(TermDepositProductAccountDto accountDtos) {
        Map<Long, Account> accounts = this.accountService.findByIds(new HashSet<>(accountDtos.values()))
                .stream()
                .collect(Collectors.toMap(BaseEntity::getId, x -> x, (a, b) -> b, HashMap::new));

        AccountType type;
        for (Map.Entry<TermDepositAccountType, Long> entry : accountDtos.entrySet()) {
            Assert.isTrue(accounts.keySet().contains(entry.getValue()),
                    String.format("%s account is not found (ID=%d)", entry.getKey(), entry.getValue()));

            type = accounts.get(entry.getValue()).getType();
            Assert.isTrue(type.equals(AccountType.BALANCE) || type.equals(AccountType.SUBGROUP),
                    String.format("%s account is type %s. Account must have type BALANCE or SUBGROUP.", entry.getKey(), type));
        }
    }
}