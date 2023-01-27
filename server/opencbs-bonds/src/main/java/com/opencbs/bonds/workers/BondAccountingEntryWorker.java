package com.opencbs.bonds.workers;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.BondAccount;
import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.domain.enums.BondAccountRuleType;
import com.opencbs.bonds.services.BondAccountService;
import com.opencbs.bonds.services.BondService;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.AbstractExchangeRateService;
import com.opencbs.core.services.GlobalSettingsService;
import com.opencbs.core.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BondAccountingEntryWorker {

    private final BondService bondService;
    private final UserService userService;
    private final AccountingEntryService accountingEntryService;
    private final AbstractExchangeRateService abstractExchangeRateService;
    private final GlobalSettingsService globalSettingsService;
    private final BondAccountService bondAccountService;

    @Autowired
    public BondAccountingEntryWorker(BondService bondService,
                                     UserService userService,
                                     AccountingEntryService accountingEntryService,
                                     AbstractExchangeRateService abstractExchangeRateService,
                                     GlobalSettingsService globalSettingsService,
                                     BondAccountService bondAccountService) {
        this.bondService = bondService;
        this.userService = userService;
        this.accountingEntryService = accountingEntryService;
        this.abstractExchangeRateService = abstractExchangeRateService;
        this.globalSettingsService = globalSettingsService;
        this.bondAccountService = bondAccountService;
    }

    public AccountingEntry createValueDateBondAccountingEntry(BondEvent bondEvent) {
        Bond bond = this.bondService.findById(bondEvent.getBondId());
        List<BondAccount> bondAccounts = bond.getBondAccounts();
        Account debitAccount = bond.getBankAccount();
        Optional<Account> creditAccount = this.getBondAccountByBondAccountRuleType(bondAccounts, BondAccountRuleType.PRINCIPAL);
        if(!creditAccount.isPresent() && debitAccount == null){
            throw new NullPointerException(String.format("The bank account or principal account of bond (ID=%d) are not set", bond.getId()));
        }
        BigDecimal amount = bond.getAmount();
        return this.getAccountEntry(bondEvent, debitAccount, creditAccount.get(), amount,"Sell Bond");
    }

    public List<AccountingEntry> getInterestRepaymentAccountingEntry(BondEvent event) {
        List<BondAccount> bondAccounts = this.bondAccountService.getAllByBondId(event.getBondId());
        Optional<Account> debitAccount = this.getBondAccountByBondAccountRuleType(bondAccounts, BondAccountRuleType.INTEREST_ACCRUAL);
        Bond bond = this.bondService.findById(event.getBondId());
        Account creditAccount = bond.getBankAccount();
        List<AccountingEntry> accountingEntries = new ArrayList<>();
        if (!debitAccount.isPresent() || creditAccount == null) {
            return accountingEntries;
        }
        Currency pivotCurrency = this.globalSettingsService.getDefaultCurrency()
                .orElseThrow(() -> new RuntimeException("There is no pivot currency"));
        BigDecimal amount =
                this.abstractExchangeRateService.getConvertedRate(pivotCurrency, bond.getCurrency(), event.getAmount(), DateHelper.getLocalDateTimeNow(), false);
        accountingEntries.add(this.getAccountEntry(event, debitAccount.get(), creditAccount, amount,"Repayment of interest"));
        return accountingEntries;
    }

    public List<AccountingEntry> getPrincipalRepaymentAccountingEntry(BondEvent event) {
        List<BondAccount> bondAccounts = this.bondAccountService.getAllByBondId(event.getBondId());
        Optional<Account> debitAccount = this.getBondAccountByBondAccountRuleType(bondAccounts, BondAccountRuleType.PRINCIPAL);
        Bond bond = this.bondService.findById(event.getBondId());
        Account creditAccount = bond.getBankAccount();
        List<AccountingEntry> accountingEntries = new ArrayList<>();
        if (!debitAccount.isPresent() || creditAccount == null)
            return accountingEntries;

        Currency pivotCurrency = this.globalSettingsService.getDefaultCurrency()
                .orElseThrow(() -> new RuntimeException("There is no pivot currency"));
        BigDecimal amount =
                this.abstractExchangeRateService.getConvertedRate(pivotCurrency, bond.getCurrency(), event.getAmount(), DateHelper.getLocalDateTimeNow(), false);
        accountingEntries.add(this.getAccountEntry(event, debitAccount.get(), creditAccount, amount,"Repayment of principal"));
        return accountingEntries;
    }

    public List<AccountingEntry> getBondPenaltyAccountingEntry(BondEvent event) {
        Currency pivotCurrency = this.globalSettingsService.getDefaultCurrency()
                .orElseThrow(() -> new RuntimeException("There is no pivot currency"));

        List<BondAccount> bondAccounts = this.bondAccountService.getAllByBondId(event.getBondId());
        Optional<Account> debitAccount = this.getBondAccountByBondAccountRuleType(bondAccounts, BondAccountRuleType.PRINCIPAL);
        Optional<Account> creditAccount = this.getBondAccountByBondAccountRuleType(bondAccounts, BondAccountRuleType.PENALTY);
        Bond bond = this.bondService.findById(event.getBondId());
        List<AccountingEntry> accountingEntries = new ArrayList<>();
        if (!debitAccount.isPresent() || !creditAccount.isPresent()) {
            return accountingEntries;
        }
        BigDecimal amount =
                this.abstractExchangeRateService.getConvertedRate(pivotCurrency,bond.getCurrency(), event.getAmount(),DateHelper.getLocalDateTimeNow(), false);
        accountingEntries.add(this.getAccountEntry(event, debitAccount.get(), creditAccount.get(), amount, "Bond penalty income")) ;
        return accountingEntries;
    }

    private Optional<Account> getBondAccountByBondAccountRuleType(List<BondAccount> bondAccounts, BondAccountRuleType ruleType) {
        Optional<BondAccount> bondAccount = bondAccounts
                .stream()
                .filter(x -> x.getBondAccountRuleType() == ruleType).findFirst();
        if (bondAccount.isPresent())
            return Optional.of(bondAccount.get().getAccount());

        return Optional.empty();
    }

    private AccountingEntry getAccountEntry(BondEvent event, Account debitAccount, Account creditAccount, BigDecimal amount, String comment) {
        User currentUser = this.userService.findById(event.getCreatedById())
                .orElseThrow(() -> new NullPointerException(String.format("User is not found (ID=%d)", event.getCreatedById())));
        AccountingEntry accountingEntry = this.accountingEntryService.getAccountingEntry(
                event.getEffectiveAt(),
                amount,
                debitAccount,
                creditAccount,
                currentUser.getBranch(),
                comment,
                currentUser,
                null);
        accountingEntry.setCreatedAt(event.getCreatedAt());
        return accountingEntry;
    }
}
