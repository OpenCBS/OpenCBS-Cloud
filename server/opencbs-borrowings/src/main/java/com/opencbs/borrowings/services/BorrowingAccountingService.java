package com.opencbs.borrowings.services;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.BorrowingAccount;
import com.opencbs.borrowings.domain.BorrowingEvent;
import com.opencbs.borrowings.domain.enums.BorrowingRuleType;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.annotations.CustomAccountingService;
import com.opencbs.core.domain.User;
import com.opencbs.core.services.UserService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@ConditionalOnMissingBean(annotation = CustomAccountingService.class)
public class BorrowingAccountingService {

    protected final BorrowingAccountService borrowingAccountService;
    protected final BorrowingService borrowingService;
    private final UserService userService;
    protected final AccountingEntryService accountingEntryService;

    public BorrowingAccountingService(BorrowingAccountService borrowingAccountService,
                                      BorrowingService borrowingService,
                                      UserService userService,
                                      AccountingEntryService accountingEntryService) {
        this.borrowingAccountService = borrowingAccountService;
        this.borrowingService = borrowingService;
        this.userService = userService;
        this.accountingEntryService = accountingEntryService;
    }

    public void createBorrowingDisbursementAccountingEntry(BorrowingEvent event) {
        List<BorrowingAccount> borrowingAccounts = this.borrowingAccountService.getAllByBorrowingId(event.getBorrowingId());
        Borrowing borrowing = this.borrowingService.findOne(event.getBorrowingId()).get();
        Account debitAccount = borrowing.getCorrespondenceAccount();
        Account creditAccount = this.getBorrowingAccountByBorrowingAccountRuleType(borrowingAccounts, BorrowingRuleType.PRINCIPAL);
        if (debitAccount == null || creditAccount == null)
            return;
        AccountingEntry accountingEntry = this.getAccountEntry(event, debitAccount, creditAccount, "Disbursement borrowing");
        accountingEntry = this.accountingEntryService.create(accountingEntry);
        event.setAccountingEntry(Arrays.asList(accountingEntry));
    }

    public void createInterestAccrualAccountingEntry(BorrowingEvent event) {
        List<BorrowingAccount> borrowingAccounts = this.borrowingAccountService.getAllByBorrowingId(event.getBorrowingId());
        Account debitAccount = this.getBorrowingAccountByBorrowingAccountRuleType(borrowingAccounts, BorrowingRuleType.INTEREST_EXPENSE);
        Account creditAccount = this.getBorrowingAccountByBorrowingAccountRuleType(borrowingAccounts, BorrowingRuleType.INTEREST_ACCRUAL);
        if (debitAccount == null || creditAccount == null)
            return;
        AccountingEntry accountingEntry = this.getAccountEntry(event, debitAccount, creditAccount, "Interest accrual");
        accountingEntry = this.accountingEntryService.create(accountingEntry);
        event.setAccountingEntry(Arrays.asList(accountingEntry));
    }

    public List<AccountingEntry> getPrincipalRepaymentAccountingEntry(BorrowingEvent event) {
        List<BorrowingAccount> borrowingAccounts = this.borrowingAccountService.getAllByBorrowingId(event.getBorrowingId());
        Account debitAccount = this.getBorrowingAccountByBorrowingAccountRuleType(borrowingAccounts, BorrowingRuleType.PRINCIPAL);
        Borrowing borrowing = this.borrowingService.findOne(event.getBorrowingId()).get();
        Account creditAccount = borrowing.getCorrespondenceAccount();
        List<AccountingEntry> accountingEntries = new ArrayList<>();
        if (debitAccount == null || creditAccount == null)
            return accountingEntries;
        accountingEntries.add(this.getAccountEntry(event, debitAccount, creditAccount, "Repayment of principal"));
        return accountingEntries;
    }

    public List<AccountingEntry> getInterestRepaymentAccountingEntry(BorrowingEvent event) {
        List<BorrowingAccount> borrowingAccounts = this.borrowingAccountService.getAllByBorrowingId(event.getBorrowingId());
        Account debitAccount = this.getBorrowingAccountByBorrowingAccountRuleType(borrowingAccounts, BorrowingRuleType.INTEREST_ACCRUAL);
        Borrowing borrowing = this.borrowingService.findOne(event.getBorrowingId()).get();
        Account creditAccount = borrowing.getCorrespondenceAccount();
        List<AccountingEntry> accountingEntries = new ArrayList<>();
        if (debitAccount == null || creditAccount == null)
            return accountingEntries;
        accountingEntries.add(this.getAccountEntry(event, debitAccount, creditAccount, "Repayment of interest"));
        return accountingEntries;
    }

    protected Account getBorrowingAccountByBorrowingAccountRuleType(List<BorrowingAccount> borrowingAccounts, BorrowingRuleType type) {
        BorrowingAccount borrowingAccount = borrowingAccounts
                .stream()
                .filter(x -> x.getAccountRuleType() == type).findFirst().orElse(null);
        return borrowingAccount == null
                ? null
                : borrowingAccount.getAccount();
    }

    protected AccountingEntry getAccountEntry(BorrowingEvent event, Account debitAccount, Account creditAccount, String comment) {
        User currentUser = this.userService.findById(event.getCreatedById()).get();
        AccountingEntry accountingEntry = this.accountingEntryService.getAccountingEntry(
                event.getEffectiveAt(),
                event.getAmount(),
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
