package com.opencbs.loans.validators;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.EntryFee;
import com.opencbs.core.domain.Penalty;
import com.opencbs.core.domain.enums.AccountRuleType;
import com.opencbs.core.domain.enums.ProfileType;
import com.opencbs.core.domain.enums.ScheduleBasedType;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.EntryFeeService;
import com.opencbs.core.services.PenaltyService;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.dto.products.LoanProductDto;
import com.opencbs.loans.services.LoanProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.*;

@Validator
public class LoanProductValidator {

    private final LoanProductService loanProductService;
    private final CurrencyService currencyService;
    private final EntryFeeService entryFeeService;
    private final AccountService accountService;
    private final PenaltyService penaltyService;

    @Autowired
    public LoanProductValidator(LoanProductService loanProductService,
                                CurrencyService currencyService,
                                EntryFeeService entryFeeService,
                                AccountService accountService,
                                PenaltyService penaltyService) {
        this.loanProductService = loanProductService;
        this.currencyService = currencyService;
        this.entryFeeService = entryFeeService;
        this.accountService = accountService;
        this.penaltyService = penaltyService;
    }

    public void validate(LoanProductDto loanProductDto) {
        Set<Long> currencies = new HashSet<>();
        Assert.isTrue(!StringUtils.isEmpty(loanProductDto.getName()), "Name is required.");
        Assert.isTrue(!StringUtils.isEmpty(loanProductDto.getName().trim()), "Name is required.");
        Assert.isTrue(!StringUtils.isEmpty(loanProductDto.getCode()), "Code is required.");
        Assert.isTrue(!StringUtils.isEmpty(loanProductDto.getCode().trim()), "Code is required.");
        Optional<LoanProduct> existingLoanProduct = this.loanProductService.findByName(loanProductDto.getName());
        Optional<LoanProduct> existingLoanProductCode = this.loanProductService.findByCode(loanProductDto.getCode());
        if (existingLoanProduct.isPresent()) {
            Assert.isTrue(existingLoanProduct.get().getId().equals(loanProductDto.getId()), "Name is taken.");
        }
        if (existingLoanProductCode.isPresent()){
            Assert.isTrue(existingLoanProductCode.get().getId().equals(loanProductDto.getId()), "Code is taken." );
        }
        if(loanProductDto.getCurrencyId() != null) {
            Optional<Currency> currency = this.currencyService.findOne(loanProductDto.getCurrencyId());
            Assert.isTrue(currency.isPresent(), "Invalid currency.");
        }

        for (Map.Entry<AccountRuleType,Long> entry : loanProductDto.getAccountList().entrySet()) {
            Account account = this.accountService.findOne(entry.getValue()).get();
            Currency accountCurrency = account.getCurrency();
            if (accountCurrency != null) {
                currencies.add(accountCurrency.getId());
            }
        }

        for (Long id : loanProductDto.getFees()) {
            Assert.isTrue(this.entryFeeService.findOne(id).isPresent(), String.format("Entry fee not found (ID=%d)", id));
            EntryFee entryFee = this.entryFeeService.findOne(id).get();
            Account account = entryFee.getAccount();
            Currency entryFeeCurrency = account.getCurrency();
            if (entryFeeCurrency != null) {
                currencies.add(entryFeeCurrency.getId());
            }
        }

        for (Long id : loanProductDto.getPenalties()) {
            Assert.isTrue(this.penaltyService.get(id).isPresent(), String.format("Penalty not found (ID=%d)", id));
            Penalty penalty = this.penaltyService.get(id).get();
            List<Account> penaltyAccounts = new ArrayList<>();
            penaltyAccounts.add(penalty.getAccrualAccount());
            penaltyAccounts.add(penalty.getIncomeAccount());
            penaltyAccounts.add(penalty.getWriteOffAccount());
            for (Account account : penaltyAccounts) {
                Currency penaltyCurrency = account.getCurrency();
                if (penaltyCurrency != null) {
                    currencies.add(penaltyCurrency.getId());
                }
            }
        }

        if (loanProductDto.getCurrencyId() != null) {
            Assert.isTrue(currencies.stream().allMatch(loanProductDto.getCurrencyId()::equals), "Product currency and all accounts currencies have to be the same");
        }
        else {
            Assert.isTrue(currencies.stream().allMatch(currencies.iterator().next()::equals), "All accounts currencies have to be the same");
        }

        Assert.notNull(loanProductDto.getInterestRateMin(), "Minimum interest rate is required.");
        Assert.isTrue(loanProductDto.getInterestRateMin().doubleValue() >= 0, "Minimum interest rate should be greater than zero.");
        Assert.isTrue(loanProductDto.getInterestRateMin().precision()
                - loanProductDto.getInterestRateMin().scale() <= 4, "Minimum interest rate should be less than 10000.");

        Assert.notNull(loanProductDto.getInterestRateMax(), "Maximum interest rate is required.");
        Assert.isTrue(loanProductDto.getInterestRateMax().doubleValue() > 0, "Maximum interest rate should be greater than zero.");
        Assert.isTrue((loanProductDto.getInterestRateMax().precision()
                - loanProductDto.getInterestRateMax().scale()) <= 4, "Maximum interest rate should be less than 10000.");
        Assert.isTrue(loanProductDto.getInterestRateMin().doubleValue() <= loanProductDto.getInterestRateMax().doubleValue(),
                "Minimum interest rate should be less than or equal to the maximum value.");

        Assert.notNull(loanProductDto.getAmountMin(), "Minimum amount is required.");
        Assert.isTrue(loanProductDto.getAmountMin().doubleValue() > 0, "Minimum amount should be greater than zero.");

        Assert.notNull(loanProductDto.getAmountMax(), "Maximum value of amount is required.");
        Assert.isTrue(loanProductDto.getAmountMax().doubleValue() > 0, "Maximum value of amount should be greater than zero.");
        Assert.isTrue(loanProductDto.getAmountMin().doubleValue() <= loanProductDto.getAmountMax().doubleValue(),
                "Minimum amount should be less than or equal to the maximum value.");

        if (loanProductDto.getScheduleBasedType().equals(ScheduleBasedType.BY_MATURITY)) {
            Assert.notNull(loanProductDto.getMaturityDateMax(), "Max maturity date is required.");
        }

        if (loanProductDto.getScheduleBasedType().equals(ScheduleBasedType.BY_INSTALLMENT)) {
            Assert.notNull(loanProductDto.getMaturityMin(), "Minimum maturity is required.");
            Assert.isTrue(loanProductDto.getMaturityMin() > 0, "Minimum maturity should be greater than zero.");

            Assert.notNull(loanProductDto.getMaturityMax(), "Maximum maturity is required.");
            Assert.isTrue(loanProductDto.getMaturityMax() > 0, "Maximum maturity should be greater than zero.");
            Assert.isTrue(loanProductDto.getMaturityMin() <= loanProductDto.getMaturityMax(),
                    "Minimum maturity should be less than or equal to the maximum value.");

            Assert.notNull(loanProductDto.getGracePeriodMin(), "Minimum grace period is required.");
            Assert.notNull(loanProductDto.getGracePeriodMax(), "Maximum grace period is required.");
            Assert.isTrue(loanProductDto.getGracePeriodMin() <= loanProductDto.getGracePeriodMax(),
                    "Minimum grace period should be less than or equal to the maximum value.");
            Assert.isTrue(loanProductDto.getGracePeriodMax() < loanProductDto.getMaturityMax(),
                    "Maximum grace period should be less than to the maximum value of maturity.");
            Assert.isTrue(loanProductDto.getGracePeriodMin() < loanProductDto.getMaturityMin(),
                    "Minimum grace period should be less than to the minimum value of maturity.");
        }

        Assert.notNull(loanProductDto.getAvailability(), "Availability is required.");
        for (String profileTypeAsText : loanProductDto.getAvailability()) {
            ProfileType profileType = ProfileType.fromString(profileTypeAsText);
            Assert.notNull(profileType, String.format("'%s' is not a valid profile type.", profileTypeAsText));
            Assert.isTrue(!(profileType.equals(ProfileType.GROUP) && loanProductDto.isHasPayees()), "Payees are not available for group profiles.");
            Assert.isTrue(!(profileType.equals(ProfileType.GROUP) && loanProductDto.getFees().size() > 0), "Entry fees are not available for group profiles.");
        }

        if(loanProductDto.isTopUpAllow()) {
            Assert.notNull(loanProductDto.getTopUpMaxLimit(), "Top Up Limit is required.");
            Assert.notNull(loanProductDto.getTopUpMaxOlb(), "Top Up Max OLB is required.");

            Assert.isTrue(loanProductDto.getTopUpMaxLimit().compareTo(BigDecimal.ZERO) >= 0,
                    "Top Up Limit should be greater than or equal to zero");
            if(loanProductDto.getTopUpMaxLimit().compareTo(BigDecimal.ZERO) > 0) {
                Assert.isTrue(loanProductDto.getTopUpMaxLimit().compareTo(loanProductDto.getAmountMax()) >= 0,
                        "Top Up Limit should be greater than or equal to Amount Max");
                Assert.isTrue(loanProductDto.getTopUpMaxLimit().compareTo(loanProductDto.getTopUpMaxOlb()) >= 0,
                        "Top Up Limit should be greater than or equal to Top Up Max OLB");
            }

            Assert.isTrue(loanProductDto.getTopUpMaxOlb().compareTo(BigDecimal.ZERO) >= 0,
                    "Top Up Max OLB should be greater than or equal zero");
            if(loanProductDto.getTopUpMaxOlb().compareTo(BigDecimal.ZERO) > 0) {
                Assert.isTrue(loanProductDto.getTopUpMaxOlb().compareTo(loanProductDto.getAmountMax()) >= 0,
                        "Top Up Max OLB should be greater than or equal than Amount Max");
            }
        }

        this.checkProvisionsAccounts(loanProductDto);
    }

    private void checkProvisionsAccounts(LoanProductDto loanProductDto) {
        if (CollectionUtils.isEmpty(loanProductDto.getProvisioning())) {
            return;
        }

        long countOfProvision = loanProductDto.getProvisioning().stream()
                .filter(provisionDto -> BigDecimal.ZERO.compareTo(provisionDto.getRatePrincipal()) > 0)
                .count();
        if (countOfProvision>0){
            this.checkAccountIsValid(loanProductDto,
                    Arrays.asList(new AccountRuleType[] {AccountRuleType.LOAN_LOSS_RESERVE, AccountRuleType.PROVISION_ON_PRINCIPAL, AccountRuleType.PROVISION_REVERSAL_ON_PRINCIPAL}));
        }

        countOfProvision = loanProductDto.getProvisioning().stream()
                .filter(provisionDto -> BigDecimal.ZERO.compareTo(provisionDto.getRateInterest()) > 0)
                .count();
        if (countOfProvision>0){
            this.checkAccountIsValid(loanProductDto,
                    Arrays.asList(new AccountRuleType[] {AccountRuleType.LOAN_LOSS_RESERVE_INTEREST, AccountRuleType.PROVISION_ON_INTERESTS, AccountRuleType.PROVISION_REVERSAL_ON_INTERESTS}));
        }

        countOfProvision = loanProductDto.getProvisioning().stream()
                .filter(provisionDto -> BigDecimal.ZERO.compareTo(provisionDto.getRatePenalty()) > 0)
                .count();
        if (countOfProvision>0){
            this.checkAccountIsValid(loanProductDto,
                    Arrays.asList(new AccountRuleType[] {AccountRuleType.LOAN_LOSS_RESERVE_PENALTIES, AccountRuleType.PROVISION_ON_LATE_FEES, AccountRuleType.PROVISION_REVERSAL_ON_LATE_FEES}));
        }

    }

    private void checkAccountIsValid(LoanProductDto loanProductDto, List<AccountRuleType> accountRuleTypes) {
        accountRuleTypes.forEach(accountRuleType -> {
            final Long accountId = loanProductDto.getAccountList().get(accountRuleType);
            Assert.notNull(accountId, String.format("Not select Account fr type %s:", accountRuleType));
        });
    }
}
