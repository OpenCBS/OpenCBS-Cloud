package com.opencbs.core.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.accounting.services.VaultService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.domain.till.Vault;
import com.opencbs.core.domain.transfers.TransferBetweenMemberships;
import com.opencbs.core.domain.transfers.TransferFromBankToVault;
import com.opencbs.core.domain.transfers.TransferFromVaultToBank;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class TransferServiceHelper {

    private final AccountService accountService;
    private final AccountingEntryService accountingEntryService;
    private final VaultService vaultService;
    private final UserService userService;

    private static final  String CHEQUE_NUMBER = "CHEQUE_NUMBER";
    private static final  String  CHEQUE_PAYEE = "CHEQUE_PAYEE";
    private static final  String  PERSON_IN_CHARGE = "PERSON_IN_CHARGE";


    public AccountingEntry transferToVault(TransferFromBankToVault transferFromBankToVault) {
        final Vault vault = vaultService.findById(transferFromBankToVault.getVaultId())
                .orElseThrow(()->new IllegalArgumentException(String.format("Not found Vault by Id:%s", transferFromBankToVault.getVaultId())));
        final Account bankAccount = this.accountService.getOne(transferFromBankToVault.getBankAccountId())
                .orElseThrow(()->new IllegalArgumentException(String.format("Not found Account by Id:%s", transferFromBankToVault.getBankAccountId())));
        final Account vaultAccount = vault.getAccounts().stream()
                .filter(account -> bankAccount.getCurrency().getId().compareTo(account.getCurrency().getId())==0)
                .findFirst()
                .orElseThrow(()->new IllegalArgumentException(String.format("Not found account with currency: %s for vault: %s", bankAccount.getCurrency().getName(), vault.getName() )));
        final AccountingEntry accountingEntry = this.buildAccountingEntry(vaultAccount, bankAccount,
                transferFromBankToVault.getAmount(), transferFromBankToVault.getDate(), transferFromBankToVault.getDescription());
        Assert.isTrue(transferFromBankToVault.getAmount().compareTo(BigDecimal.ZERO) > 0, "Amount must be greater than zero.");

        ExtraJson extra = new ExtraJson();
        User user = this.userService.findById(transferFromBankToVault.getPersonInCharge())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found (ID=%d).", transferFromBankToVault.getPersonInCharge())));
        extra.put(PERSON_IN_CHARGE, user.getName());
        extra.put(CHEQUE_NUMBER, transferFromBankToVault.getChequeNumber());
        extra.put(CHEQUE_PAYEE, transferFromBankToVault.getChequePayee());
        accountingEntry.setExtra(extra);

        return this.accountingEntryService.save(accountingEntry);
    }

    public AccountingEntry transferToBank(TransferFromVaultToBank transferFromVaultToBank) {
        final Vault vault = vaultService.findById(transferFromVaultToBank.getVaultId())
                .orElseThrow(()->new IllegalArgumentException(String.format("Not found Vault by Id:%s", transferFromVaultToBank.getVaultId())));
        final Account vaultAccount = vault.getAccounts().stream()
                .filter(account -> account.getCurrency().getId().compareTo(transferFromVaultToBank.getCurrencyId())==0)
                .findFirst()
                .orElseThrow(()->new IllegalArgumentException(String.format("Not found account with currency Id:%s for vault: %s", transferFromVaultToBank.getCurrencyId(), vault.getName() )));
        final Account bankAccount = this.accountService.getOne(transferFromVaultToBank.getBankAccountId())
                .orElseThrow(()->new IllegalArgumentException(String.format("Not found Account by Id:%s", transferFromVaultToBank.getBankAccountId())));
        final AccountingEntry accountingEntry = this.buildAccountingEntry(bankAccount, vaultAccount,
                transferFromVaultToBank.getAmount(), transferFromVaultToBank.getDate(), transferFromVaultToBank.getDescription());
        Assert.isTrue(transferFromVaultToBank.getAmount().compareTo(BigDecimal.ZERO) > 0, "Amount must be greater than zero.");

        ExtraJson extra = new ExtraJson();
        User user = this.userService.findById(transferFromVaultToBank.getPersonInCharge())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found (ID=%d).", transferFromVaultToBank.getPersonInCharge())));
        extra.put(PERSON_IN_CHARGE, user.getName());
        accountingEntry.setExtra(extra);

        return this.accountingEntryService.save(accountingEntry);
    }

    public AccountingEntry transferBetweenMembership(TransferBetweenMemberships transferBetweenMemberships) {
        final Account sourceAccount = this.accountService.findOne(transferBetweenMemberships.getSourceAccountId())
                .orElseThrow(()->new IllegalArgumentException(String.format("Not found source account with Id:%s", transferBetweenMemberships.getSourceAccountId())));
        final Account destinationAccount = this.accountService.findOne(transferBetweenMemberships.getDestinationAccountId())
                .orElseThrow(()->new IllegalArgumentException(String.format("Not found destination account with Id:%s", transferBetweenMemberships.getDestinationAccountId())));
        Assert.isTrue(transferBetweenMemberships.getAmount().compareTo(BigDecimal.ZERO) > 0, "Amount must be greater than zero.");

        AccountingEntry accountingEntry = buildAccountingEntry(sourceAccount, destinationAccount, transferBetweenMemberships.getAmount(),
                transferBetweenMemberships.getDate(), transferBetweenMemberships.getDescription()
        );

        return this.accountingEntryService.create(accountingEntry);
    }

    private AccountingEntry buildAccountingEntry(Account sourceAccount, Account destinationAccount, BigDecimal amount, LocalDate transferDate, String description) {
        return AccountingEntry.builder()
                    .debitAccount(sourceAccount)
                    .creditAccount(destinationAccount)
                    .amount(amount)
                    .effectiveAt(LocalDateTime.of(transferDate, DateHelper.getLocalTimeNow()))
                    .description(description)
                    .createdBy(UserHelper.getCurrentUser())
                    .branch(UserHelper.getCurrentUser().getBranch())
                    .createdAt(DateHelper.getLocalDateTimeNow())
                    .deleted(Boolean.FALSE)
                    .build();
    }
}
