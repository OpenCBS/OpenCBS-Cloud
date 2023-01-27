package com.opencbs.savings.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.savings.domain.Saving;
import com.opencbs.savings.domain.SavingAccount;
import com.opencbs.savings.domain.SavingAccountingEntry;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import com.opencbs.savings.repositories.SavingAccountRepository;
import com.opencbs.savings.repositories.SavingAccountingEntryRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavingAccountingService {

    private final AccountingEntryService accountingEntryService;
    private final SavingAccountRepository savingAccountRepository;
    private final SavingAccountGenerator savingAccountGenerator;
    private final SavingAccountingEntryRepository savingAccountingEntryRepository;


    public Account getAccount(List<SavingAccount> accounts, SavingAccountRuleType type) {
        SavingAccount savingAccount = accounts
                .stream()
                .filter(x -> x.getType().equals(type))
                .findFirst()
                .orElseThrow(() -> new RuntimeException(String.format("Account is not found by saving rule(%s).", type.toString())));
        return savingAccount.getAccount();
    }

    public AccountingEntry getInitialAmountEntry(BigDecimal amount, Saving saving, Account currentAccount, User user) {
        Account savingAccount = this.getAccount(saving.getAccounts(), SavingAccountRuleType.SAVING);
        return this.createSavingEntry(currentAccount, savingAccount, amount, saving, "Initial", saving.getOpenDate(), user);
    }

    public AccountingEntry getCloseEntry(BigDecimal amount, Saving saving, Account currentAccount, User user) {
        Account savingAccount = this.getAccount(saving.getAccounts(), SavingAccountRuleType.SAVING);
        return this.createSavingEntry(savingAccount, currentAccount, amount, saving, "Close", saving.getCloseDate(), user);
    }

    public AccountingEntry getDepositEntry(BigDecimal amount, Saving saving, Account currentAccount, User user) {
        Account savingAccount = this.getAccount(saving.getAccounts(), SavingAccountRuleType.SAVING);
        return this.createSavingEntry(currentAccount, savingAccount, amount, saving, "Deposit", saving.getDepositDate(), user);
    }

    public AccountingEntry getWithdrawEntry(BigDecimal amount, Saving saving, Account currentAccount, User user) {
        Account savingAccount = this.getAccount(saving.getAccounts(), SavingAccountRuleType.SAVING);
        return this.createSavingEntry(savingAccount, currentAccount, amount, saving, "Withdraw", saving.getWithdrawDate(), user);
    }

    public List<AccountingEntry> getEntryFeeAccountEntries(BigDecimal feeRateAmount, Saving saving, Account currentAccount, User user) {
        Account entryFeeAccount = this.getAccount(saving.getAccounts(), SavingAccountRuleType.ENTRY_FEE);
        Account entryFeeIncomeAccount = this.getAccount(saving.getAccounts(), SavingAccountRuleType.ENTRY_FEE_INCOME);
        return this.getSavingFeeAccountingEntries(currentAccount, entryFeeAccount, entryFeeIncomeAccount, feeRateAmount, saving.getEntryFeeFlat(),
                saving, saving.getOpenDate(),"Entry fee", user);
    }

    public List<AccountingEntry> getCloseFeeAccountEntries(BigDecimal feeRateAmount, Saving saving, Account currentAccount, User user) {
        Account closeFeeAccount = this.getAccount(saving.getAccounts(), SavingAccountRuleType.CLOSE_FEE);
        Account closeFeeIncomeAccount = this.getAccount(saving.getAccounts(), SavingAccountRuleType.CLOSE_FEE_INCOME);
        return this.getSavingFeeAccountingEntries(currentAccount, closeFeeAccount, closeFeeIncomeAccount, feeRateAmount, saving.getCloseFeeFlat(),
                saving, saving.getCloseDate(),"Close fee", user);
    }

    public List<AccountingEntry> getDepositFeeAccountEntries(BigDecimal feeRateAmount, Saving saving, Account currentAccount, User user) {
        Account depositFeeAccount = this.getAccount(saving.getAccounts(), SavingAccountRuleType.DEPOSIT_FEE);
        Account depositFeeIncomeAccount = this.getAccount(saving.getAccounts(), SavingAccountRuleType.DEPOSIT_FEE_INCOME);
        return this.getSavingFeeAccountingEntries(currentAccount, depositFeeAccount, depositFeeIncomeAccount, feeRateAmount, saving.getDepositFeeFlat(),
                saving, saving.getDepositDate(),"Deposit fee", user);
    }

    public List<AccountingEntry> getWithdrawFeeAccountEntries(BigDecimal feeRateAmount, Saving saving, Account currentAccount, User user) {
        Account withdrawFeeAccount = this.getAccount(saving.getAccounts(), SavingAccountRuleType.WITHDRAWAL_FEE);
        Account withdrawFeeIncomeAccount = this.getAccount(saving.getAccounts(), SavingAccountRuleType.WITHDRAWAL_FEE_INCOME);
        return this.getSavingFeeAccountingEntries(currentAccount, withdrawFeeAccount, withdrawFeeIncomeAccount, feeRateAmount, saving.getWithdrawalFeeFlat(),
                saving, saving.getWithdrawDate(),"Withdraw fee", user);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<SavingAccount> createAccounts(@NonNull Saving saving) {
        if (saving.getProduct().getAccounts().size() != SavingAccountRuleType.values().length) {
            throw new RuntimeException("Accounts should be configured in the Saving Product");
        }

        return saving.getProduct().getAccounts().stream()
                .filter(account ->
                        !savingAccountRepository.findBySavingAndTypeAndAccount(
                                saving.getId(),
                                account.getType(),
                                account.getAccount().getId()).isPresent()
                )
                .map(x -> savingAccountGenerator.getAccount(saving, x.getAccount(), x.getType()))
                .collect(Collectors.toList());
    }

    private List<AccountingEntry> getSavingFeeAccountingEntries(Account currentAccount, Account feeAccount, Account feeIncomeAccount,
                                                                BigDecimal feeRateAmount, BigDecimal feeFlatAmount, Saving saving,
                                                                LocalDateTime operationDate, String massage, User user){
        List<AccountingEntry> entries = new ArrayList<>();

        if (feeFlatAmount.doubleValue() > 0) {
            AccountingEntry entry = this.createSavingEntry(feeAccount, feeIncomeAccount, feeFlatAmount, saving,
                    String.format("%s flat accrual", massage), operationDate, user);
            entries.add(entry);

            entry = this.createSavingEntry(currentAccount, feeAccount, feeFlatAmount, saving,
                    String.format("%s flat income", massage), operationDate, user);
            entries.add(entry);
        }

        if (feeRateAmount.doubleValue() > 0) {
            AccountingEntry entry = this.createSavingEntry(feeAccount, feeIncomeAccount, feeRateAmount, saving,
                    String.format("%s rate accrual", massage), operationDate, user);
            entries.add(entry);

            entry = this.createSavingEntry(currentAccount, feeAccount, feeRateAmount, saving,
                    String.format("%s rate income", massage), operationDate, user);
            entries.add(entry);
        }
        return entries;
    }

    private AccountingEntry createSavingEntry(Account debitAccount, Account creditAccount, BigDecimal amount, Saving saving, String message, LocalDateTime dateTime, User user) {
        dateTime = LocalDateTime.of(dateTime.toLocalDate(), DateHelper.getLocalTimeNow());
        return this.accountingEntryService.getAccountingEntry(
                dateTime,
                amount,
                debitAccount,
                creditAccount,
                saving.getProfile().getBranch(),
                String.format("%s saving entry for %s.", message, saving.getCode()),
                user,
                null
        );
    }

    public Page<AccountingEntry> getAccountingEntriesBySavingId(Long id, Pageable pageable) {
        Page<SavingAccountingEntry> savingAccountingEntries = this.savingAccountingEntryRepository.findBySavingIdOrderByAccountingEntryId(id, pageable);

        return new PageImpl(savingAccountingEntries
                            .getContent()
                            .stream()
                            .map(x -> this.accountingEntryService.findById(x.getAccountingEntryId()))
                            .sorted(Comparator.comparing(AccountingEntry::getEffectiveAt)).collect(Collectors.toList()), pageable, savingAccountingEntries.getTotalElements());
    }
}
