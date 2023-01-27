package com.opencbs.core.accounting.validators;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.dto.TillDto;
import com.opencbs.core.accounting.dto.TillTransactionDto;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.accounting.services.TillService;
import com.opencbs.core.accounting.services.VaultService;
import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.domain.till.Till;
import com.opencbs.core.domain.till.Vault;
import com.opencbs.core.dto.OperationBaseDto;
import com.opencbs.core.dto.OperationDto;
import com.opencbs.core.dto.TransferDto;
import com.opencbs.core.exceptions.ApiException;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.BranchService;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Validator
public class TillValidator {

    private final BranchService branchService;
    private final AccountService accountService;
    private final VaultService vaultService;
    private final TillService tillService;
    private final ProfileService profileService;
    private final CurrencyService currencyService;
    private final AccountingEntryService accountingEntryService;

    @Autowired
    public TillValidator(BranchService branchService,
                         AccountService accountService,
                         VaultService vaultService,
                         TillService tillService,
                         ProfileService profileService,
                         CurrencyService currencyService,
                         AccountingEntryService accountingEntryService) {
        this.branchService = branchService;
        this.accountService = accountService;
        this.vaultService = vaultService;
        this.tillService = tillService;
        this.profileService = profileService;
        this.currencyService = currencyService;
        this.accountingEntryService = accountingEntryService;
    }

    public void validateOnCreate(TillDto dto) throws ApiException {
        this.validate(dto);

        Assert.isTrue(!this.tillService.findByName(dto.getName()).isPresent(), "Name is already taken.");
    }

    public void validateOnUpdate(TillDto dto) throws ApiException {
        this.validate(dto);
        Optional<Till> till = this.tillService.findByName(dto.getName());
        if (till.isPresent()) {
            Assert.isTrue(till.get().getId().equals(dto.getId()), "Name is already taken.");
        }
    }

    public void validateOpenTillDto(long tellerId) {
        Assert.notNull(tellerId, "Teller ID cannot be empty.");
        Assert.isTrue(this.tillService.findAll()
                .stream()
                .noneMatch(x -> x.getTeller() != null && x.getTeller().getId().equals(tellerId)), "Teller already assigned.");
    }

    public void validateTransfer(TransferDto dto) {
        Assert.notNull(dto.getTillId(), "Till cannot be empty.");
        Assert.notNull(dto.getVaultId(), "Vault cannot be empty.");
        Assert.notNull(dto.getVaultId(), "Description cannot be empty.");
        Optional<Till> till = this.tillService.findOne(dto.getTillId());

        Assert.isTrue(till.isPresent(), String.format("Till not found (ID=%d).", till.get().getId()));
        for (TillTransactionDto x : dto.getTransactions()) {
            Assert.isTrue(this.tillService.findAccount(x.getCurrencyId(), till.get().getAccounts()).isPresent(),
                    String.format("Till does not have account for currency (CURRENCY_ID=%d).", x.getCurrencyId()));
        }

        Optional<Vault> vault = this.vaultService.findById(dto.getVaultId());
        Assert.isTrue(vault.isPresent(), String.format("Vault not found (ID=%d).", till.get().getId()));
        for (TillTransactionDto x : dto.getTransactions()) {
            Assert.notNull(this.tillService.findAccount(x.getCurrencyId(), vault.get().getAccounts()).isPresent(),
                    String.format("Vault does not have account for currency (CURRENCY_ID=%d).", x.getCurrencyId()));
        }

        for (TillTransactionDto x : dto.getTransactions()) {
            Assert.isTrue(x.getAmount().compareTo(BigDecimal.ZERO) > 0, "Amount must be greater than zero.");
        }
    }

    public void validateOperationCA(OperationDto dto) throws ResourceNotFoundException {
        this.validateOperation(dto);

        if (!dto.getIsProfileExist()) {
            Assert.isTrue(!StringUtils.isEmpty(dto.getInitiator()), "Depositor or Withdrawer is required.");
        }
        else {
            Assert.notNull(dto.getProfileId(), "Profile is required.");
            Profile profile = this.profileService.findOne(dto.getProfileId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Profile not found (ID=%d).", dto.getProfileId())));
            Assert.isTrue(profile.getCurrentAccounts()
                    .stream()
                    .anyMatch(x -> x.getId().equals(dto.getId())), String.format("Account not belong to profile (ACCOUNT_ID=%d)", dto.getId()));
        }
    }

    public void validateOnWithdraw(OperationDto dto) throws ResourceNotFoundException {
        this.validateOperationCA(dto);
        BigDecimal currentBalance = this.accountService.getAccountBalance(dto.getId(), DateHelper.getLocalDateTimeNow());
        Assert.isTrue(dto.getAmount().compareTo(currentBalance) <= 0, "Amount should be less than or equal to the current balance.");
    }

    public void validateOperation(OperationBaseDto dto) throws ResourceNotFoundException {
        Assert.notNull(dto.getId(), "Account is required.");
        Assert.isTrue(this.accountService.findOne(dto.getId()).isPresent(), String.format("Account not found (ID=%d).", dto.getId()));
        Assert.notNull(dto.getAmount(), "Amount is required.");
        Assert.isTrue(dto.getAmount().doubleValue() > 0, "Amount must be greater than zero.");
        Assert.isTrue(!StringUtils.isEmpty(dto.getDescription()), "Description is required.");
    }

    private void validate(TillDto dto) throws ApiException {
        Assert.notNull(dto.getName(), "Till name cannot be empty.");
        Assert.isTrue(!StringUtils.isEmpty(dto.getName().trim()), "Till name cannot be empty.");
        Assert.notNull(dto.getBranchId(), "Branch id of till cannot be empty.");

        Assert.notEmpty(dto.getAccounts(), "Accounts is required.");

        for (Long accountId : dto.getAccounts()) {
            this.accountService.findOne(accountId)
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found (ID=%d).", accountId)));
            Assert.isTrue(this.tillService
                            .findAll()
                            .stream()
                            .flatMap(till -> till.getAccounts()
                                    .stream())
                            .noneMatch(account -> account.getId().equals(accountId)),
                    "Account already assigned to another till.");
        }

        Assert.isTrue(this.branchService.findOne(dto.getBranchId()).isPresent(), "There are no branch with this id.");
    }

    public void validateOnGetOperation(Till till, Long currencyId) throws ResourceNotFoundException {
        if (currencyId == null) {
            return;
        }
        Currency currency = this.currencyService.findOne(currencyId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Currency not found(ID=%d)", currencyId)));
        Assert.isTrue(till.getAccounts()
                .stream()
                .filter(x -> x.getCurrency().getId().equals(currency.getId()))
                .findAny()
                .isPresent(), "Till does not have account for this currency.");
    }
}
