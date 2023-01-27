package com.opencbs.loans.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.annotations.CustomAccountingService;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.EntryFee;
import com.opencbs.core.domain.OtherFee;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.AccountRuleType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.NumericHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.repositories.BranchRepository;
import com.opencbs.core.services.UserService;
import com.opencbs.loans.domain.*;
import com.opencbs.loans.repositories.LoanRepository;
import com.opencbs.loans.repositories.customs.LoanEventAccountingEntryRepository;
import com.opencbs.loans.repositories.customs.LoanPenaltyEventAccountingEntryRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
@Service
@ConditionalOnMissingBean(annotation = CustomAccountingService.class)
public class LoanAccountingService {

    protected final LoanProductAccountService loanProductAccountService;
    protected final LoanAccountService loanAccountService;
    protected final AccountService accountService;
    protected final AccountingEntryService accountingEntryService;
    protected final LoanRepository loanRepository;
    protected final UserService userService;
    protected final LoanEventService loanEventService;
    protected final BranchRepository branchRepository;
    protected final LoanPenaltyAccountService loanPenaltyAccountService;
    protected final LoanEventAccountingEntryRepository loanEventAccountingEntryRepository;
    protected final LoanPenaltyEventAccountingEntryRepository loanPenaltyEventAccountingEntryRepository;


    public void createTopUpAccountingEntry(LoanEvent event) {
        Loan loan = loanRepository.getOne(event.getLoanId());
        createLoanDisbursementAccountingEntry(event, loan,"Top up");
    }

    public void createLoanDisbursementAccountingEntry(LoanEvent event, Loan loan, String description) {
        List<LoanAccount> loanAccounts = this.loanAccountService.getAllByLoanId(loan.getId());
        Account debitAccount = this.getLoanAccountByAccountRuleType(loanAccounts, AccountRuleType.PRINCIPAL);
        Account creditAccount = this.getCurrentAccountFromLoan(loan);
        if (debitAccount == null)
            return;
        AccountingEntry accountingEntry = this.getAccountEntry(event, debitAccount, creditAccount, description);
        this.accountingEntryService.create(accountingEntry);

        List<AccountingEntry> accountingEntries = new ArrayList<>();
        accountingEntries.add(accountingEntry);

        event.setAccountingEntry(accountingEntries);
        loanEventService.save(event);
    }

    public void createEntryFeeAccountingEntry(LoanEvent event, Loan loan, EntryFee entryFee, String description) {
        if (NumericHelper.isZero(event.getAmount())) {
            return;
        }

        Account debitAccount = this.getCurrentAccountFromLoan(loan);
        Account creditAccount = entryFee.getAccount();
        AccountingEntry accountingEntry = this.getAccountEntry(event, debitAccount, creditAccount, description);
        this.accountingEntryService.create(accountingEntry);
        List<AccountingEntry> entries = new ArrayList<>();
        entries.add(accountingEntry);
        this.createLoanEventAccountingEntries(entries, UserHelper.getCurrentUser(), accountingEntry.getEffectiveAt(), event);
    }

    public void createInterestAccrualAccountingEntry(LoanEvent event) {
        if (NumericHelper.isZero(event.getAmount())) {
            return;
        }

        List<LoanAccount> loanAccounts = this.loanAccountService.getAllByLoanId(event.getLoanId());
        Account debitAccount = this.getLoanAccountByAccountRuleType(loanAccounts, AccountRuleType.INTEREST_ACCRUAL);
        Account creditAccount = this.getLoanAccountByAccountRuleType(loanAccounts, AccountRuleType.INTEREST_INCOME);
        if (debitAccount == null || creditAccount == null)
            return;
        AccountingEntry accountingEntry = this.getAccountEntry(event, debitAccount, creditAccount, "Interest accrual");
        this.accountingEntryService.create(accountingEntry);
    }

    public List<AccountingEntry> getPrincipalRepaymentAccountingEntry(BigDecimal amount, LoanEvent event) {
        List<LoanAccount> loanAccounts = loanAccountService.getAllByLoanId(event.getLoanId());
        Loan loan = loanRepository.findOne(event.getLoanId());

        Account debitAccount = getCurrentAccountFromLoan(loan);
        Account creditAccount = getLoanAccountByAccountRuleType(loanAccounts, AccountRuleType.PRINCIPAL);

        return Collections.singletonList(
                accountingEntryService.getAccountingEntry(
                        event.getEffectiveAt(),
                        amount,
                        debitAccount,
                        creditAccount,
                        UserHelper.getCurrentUser().getBranch(),
                        "Repayment of principal",
                        UserHelper.getCurrentUser(),
                        null
                )
        );
    }

    public List<AccountingEntry> getInterestRepaymentAccountingEntry(BigDecimal amount, LoanEvent event) {
        List<LoanAccount> loanAccounts = loanAccountService.getAllByLoanId(event.getLoanId());
        Loan loan = loanRepository.findOne(event.getLoanId());
        Account debitAccount = getCurrentAccountFromLoan(loan);
        Account creditAccount = getLoanAccountByAccountRuleType(loanAccounts, AccountRuleType.INTEREST_ACCRUAL);

        return Collections.singletonList(
                accountingEntryService.getAccountingEntry(
                        event.getEffectiveAt(),
                        amount,
                        debitAccount,
                        creditAccount,
                        UserHelper.getCurrentUser().getBranch(),
                        "Repayment of interest",
                        UserHelper.getCurrentUser(),
                        null
                )
        );
    }

    public List<AccountingEntry> getInterestAccrualAccountingEntry(BigDecimal amount, LoanEvent event) {
        List<LoanAccount> loanAccounts = this.loanAccountService.getAllByLoanId(event.getLoanId());
        Account debitAccount = this.getLoanAccountByAccountRuleType(loanAccounts, AccountRuleType.INTEREST_ACCRUAL);
        Account creditAccount = this.getLoanAccountByAccountRuleType(loanAccounts, AccountRuleType.INTEREST_INCOME);

        AccountingEntry accountingEntry = this.accountingEntryService.getAccountingEntry(event.getEffectiveAt(), amount, debitAccount,
                creditAccount, UserHelper.getCurrentUser().getBranch(), "Interest accrual", UserHelper.getCurrentUser(), null);

        return Collections.singletonList(accountingEntry);
    }

    public List<AccountingEntry> getPenaltyRepaymentAccountingEntry(@NonNull BigDecimal amount, @NonNull LoanEvent event, @NonNull LoanPenaltyAccount penaltyAccount) {
        Loan loan = loanRepository.findOne(event.getLoanId());

        Account debitAccount = getCurrentAccountFromLoan(loan);
        Account creditAccount = penaltyAccount.getAccrualAccount();

        return Collections.singletonList(
                accountingEntryService.getAccountingEntry(
                        event.getEffectiveAt(),
                        amount,
                        debitAccount,
                        creditAccount,
                        UserHelper.getCurrentUser().getBranch(),
                        "Repayment of penalty: " + penaltyAccount.getLoanApplicationPenalty().getName(),
                        UserHelper.getCurrentUser(),
                        null
                )
        );
    }

    public List<AccountingEntry> getEarlyRepaymentFeeAccountingEntry(BigDecimal amount, LoanEvent event, Boolean isTotalRepayment) {
        List<LoanAccount> loanAccounts = loanAccountService.getAllByLoanId(event.getLoanId());
        Loan loan = loanRepository.findOne(event.getLoanId());
        Account debitAccount = getCurrentAccountFromLoan(loan);
        Account creditAccount =  this.getLoanAccountByAccountRuleType(loanAccounts,
                (isTotalRepayment)?AccountRuleType.EARLY_TOTAL_REPAYMENT_FEE_INCOME:AccountRuleType.EARLY_PARTIAL_REPAYMENT_FEE_INCOME);

        return Collections.singletonList(
                accountingEntryService.getAccountingEntry(
                        event.getEffectiveAt(),
                        amount,
                        debitAccount,
                        creditAccount,
                        UserHelper.getCurrentUser().getBranch(),
                        "Early repayment fee charging",
                        UserHelper.getCurrentUser(),
                        null
                )
        );
    }

    public void chargeOtherFee(LoanEvent loanEvent, User currentUser) {
        OtherFee otherFee = loanEvent.getOtherFee();
        Account debitAccount = otherFee.getChargeAccount();
        Account creditAccount = otherFee.getIncomeAccount();
        AccountingEntry accountingEntry = this.accountingEntryService.getAccountingEntry(loanEvent.getEffectiveAt(), loanEvent.getAmount(), debitAccount,
                creditAccount, currentUser.getBranch(), String.format("Other fee - %s - charging", otherFee.getName()),
                currentUser, null);
        this.accountingEntryService.create(accountingEntry);
    }

    public void repayOtherFee(LoanEvent loanEvent, User currentUser, Loan loan) {
        OtherFee otherFee = loanEvent.getOtherFee();
        Account debitAccount = getCurrentAccountFromLoan(loan);
        Account creditAccount = otherFee.getChargeAccount();
        AccountingEntry accountingEntry = this.accountingEntryService.getAccountingEntry(loanEvent.getEffectiveAt(), loanEvent.getAmount(), debitAccount,
                creditAccount, currentUser.getBranch(), String.format("Other fee - %s - repayment", otherFee.getName()),
                currentUser, null);
        this.accountingEntryService.create(accountingEntry);
    }

    public void waiveOffOtherFee(LoanEvent loanEvent, User currentUser) {
        OtherFee otherFee = loanEvent.getOtherFee();
        Account debitAccount = otherFee.getExpenseAccount();
        Account creditAccount = otherFee.getChargeAccount();
        AccountingEntry accountingEntry = this.accountingEntryService.getAccountingEntry(loanEvent.getEffectiveAt(), loanEvent.getAmount(), debitAccount,
                creditAccount, currentUser.getBranch(), String.format("Other fee - %s - way off ", otherFee.getName()),
                currentUser, null);
        this.accountingEntryService.create(accountingEntry);
    }


    public void createWriteOffPrincipalAccountingEntry(LoanEvent event) {
        List<LoanAccount> loanAccounts = this.loanAccountService.getAllByLoanId(event.getLoanId());
        Account debitAccount = this.getLoanAccountByAccountRuleType(loanAccounts, AccountRuleType.WRITE_OFF_PORTFOLIO);
        Account creditAccount = this.getLoanAccountByAccountRuleType(loanAccounts, AccountRuleType.PRINCIPAL);
        if (debitAccount == null || creditAccount == null)
            return;

        AccountingEntry accountingEntry = this.getAccountEntry(event, debitAccount, creditAccount, event.getComment());
        this.accountingEntryService.create(accountingEntry);
    }

    public void createWriteOffInterestAccountingEntry(LoanEvent event) {
        List<LoanAccount> loanAccounts = this.loanAccountService.getAllByLoanId(event.getLoanId());
        Account debitAccount = this.getLoanAccountByAccountRuleType(loanAccounts, AccountRuleType.WRITE_OFF_INTEREST);
        Account creditAccount = this.getLoanAccountByAccountRuleType(loanAccounts, AccountRuleType.INTEREST_ACCRUAL);
        if (debitAccount == null || creditAccount == null)
            return;
        AccountingEntry accountingEntry = this.getAccountEntry(event, debitAccount, creditAccount, event.getComment());
        this.accountingEntryService.create(accountingEntry);
    }

    protected Account getLoanAccountByAccountRuleType(List<LoanAccount> loanAccounts, AccountRuleType type) {
        LoanAccount loanAccount = loanAccounts.stream().filter(x -> x.getAccountRuleType() == type).findFirst().orElse(null);
        return loanAccount == null
                ? null
                : loanAccount.getAccount();
    }

    protected Account getAccountByAccountNumber(List<LoanAccount> accounts, String number) {
        LoanAccount loanAccount = accounts.stream()
                .filter(x -> x.getAccount().getNumber().equals(number))
                .findFirst()
                .orElse(null);

        return loanAccount == null ? null : loanAccount.getAccount();
    }

    public Account getCurrentAccountFromLoan(Loan loan) {
        return loan.getProfile().getCurrentAccounts()
                .stream()
                .filter(x -> x.getCurrency().getId().equals(loan.getCurrencyId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(String.format("Current account for currency ID %s not found", loan.getCurrencyId())));
    }

    protected AccountingEntry getAccountEntry(LoanEvent event, Account debitAccount, Account creditAccount, String comment) {
        User currentUser = this.userService.getOne(event.getCreatedById()).get();
        AccountingEntry accountingEntry = this.accountingEntryService.getAccountingEntry(event.getEffectiveAt(),event.getAmount(), debitAccount,
                creditAccount, currentUser.getBranch(), comment, currentUser, null);
        accountingEntry.setCreatedAt(event.getCreatedAt());
        return accountingEntry;
    }

    public void createLoanEventAccountingEntries(List<AccountingEntry> accountingEntryList, User user, LocalDateTime effectiveAt, LoanEvent event) {
        Branch branch = this.branchRepository.findAll().stream().findFirst().orElse(null);
        for (AccountingEntry accountingEntry : accountingEntryList) {
            accountingEntry.setCreatedAt(DateHelper.getLocalDateTimeNow());
            accountingEntry.setEffectiveAt(effectiveAt);
            accountingEntry.setCreatedBy(user);
            accountingEntry.setBranch(branch);
            accountingEntry = accountingEntryService.create(accountingEntry);
            loanEventAccountingEntryRepository.save(new LoanEventAccountingEntry(event.getId(), accountingEntry.getId()));
        }
    }

    public void createLoanPenaltyEventAccountingEntries(List<AccountingEntry> accountingEntryList, User user, LocalDateTime effectiveAt, LoanPenaltyEvent event) {
        Branch branch = this.branchRepository.findAll().stream().findFirst().orElse(null);
        for (AccountingEntry accountingEntry : accountingEntryList) {
            accountingEntry.setCreatedAt(DateHelper.getLocalDateTimeNow());
            accountingEntry.setEffectiveAt(effectiveAt);
            accountingEntry.setCreatedBy(user);
            accountingEntry.setBranch(branch);
            accountingEntry = accountingEntryService.create(accountingEntry);
            loanPenaltyEventAccountingEntryRepository.save(new LoanPenaltyEventAccountingEntry(event.getId(), accountingEntry.getId()));
        }
    }
}
