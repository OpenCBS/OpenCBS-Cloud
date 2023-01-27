package com.opencbs.savings.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.savings.annotations.CustomSavingAccountGenerator;
import com.opencbs.savings.domain.Saving;
import com.opencbs.savings.domain.SavingAccount;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@ConditionalOnMissingBean(annotation = CustomSavingAccountGenerator.class)
public class SavingAccountGeneratorService implements SavingAccountGenerator {

    private final AccountService accountService;

    @Override
    public SavingAccount getAccount(Saving saving, Account account, SavingAccountRuleType savingAccountRuleType) {
        if (this.validAccount(account)) {
            throw new RuntimeException(String.format("Account %s should be SUBGROUP or BALANCE", account.getNumber()));
        }

        SavingAccount savingAccount = new SavingAccount();
        savingAccount.setSaving(saving);
        savingAccount.setType(savingAccountRuleType);

        if (account.getType().equals(AccountType.BALANCE)) {
            savingAccount.setAccount(account);
            return savingAccount;
        }

        String number = String.format("%s%s", account.getNumber(), String.format("%06d", saving.getId()));
        Optional<Account> existedAccount = this.accountService.findByNumber(number);
        if (existedAccount.isPresent()) {
            savingAccount.setAccount(existedAccount.get());
            return savingAccount;
        }

        Account newAccount = account.toBuilder().build();
        newAccount = this.accountService.getBalanceAccount(account, newAccount, saving.getId(),
                account.getName(), saving.getProfile().getName(), saving.getCode());
        newAccount.setCurrency(saving.getProduct().getCurrency());
        savingAccount.setAccount(newAccount);
        return savingAccount;
    }

    private boolean validAccount(Account account) {
        return account.getType() != AccountType.SUBGROUP && account.getType() != AccountType.BALANCE;
    }
}
