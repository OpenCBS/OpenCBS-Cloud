package com.opencbs.core.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountExtendedTag;
import com.opencbs.core.accounting.domain.AccountTagType;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountTagService;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.helpers.DateHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public abstract class CoreCurrentAccountGeneratorBase {

    private final AccountTagService accountTagService;
    protected final AccountService accountService;


    protected Account getSubgroup(Currency currency, User currentUser) {
        List<AccountExtendedTag> parentAccount =
                this.accountTagService.getAllByAccountTagIdAndType(AccountTagType.CURRENT_ACCOUNT.getId(), AccountType.GROUP);
        Account currentParentAccount = parentAccount.get(0).getAccount();

        List<AccountExtendedTag> accounts =
                this.accountTagService.getAllByAccountTagIdAndType(AccountTagType.CURRENT_ACCOUNT.getId(), AccountType.SUBGROUP);
        accounts = accounts.stream().sorted(Comparator.comparing(x -> x.getAccount().getNumber())).collect(Collectors.toList());

        Account accountGroup = accounts
                .stream()
                .map(AccountExtendedTag::getAccount)
                .filter(account -> account.getCurrency().getId().equals(currency.getId())).findFirst().orElse(new Account());

        if (accountGroup.getId() == null) {
            accountGroup = this.accountService.create(this.getAccount(
                    String.format("%s%s", currentParentAccount.getNumber(), currency.getCode()),
                    currentParentAccount,
                    currency,
                    currentUser,
                    String.format("%s %s", currentParentAccount.getName(), currency.getName()),
                    AccountType.SUBGROUP));
        }

        return accountGroup;
    }

    protected Account getAccount(String number, Account parent, Currency currency, User currentUser, String name, AccountType type) {
        Account currentAccount = new Account();
        currentAccount.setNumber(number);
        currentAccount.setParent(parent);
        currentAccount.setCurrency(currency);
        currentAccount.setStartDate(DateHelper.getLocalDateTimeNow());
        currentAccount.setIsDebit(false);
        currentAccount.setType(type);
        currentAccount.setName(name);
        currentAccount.setBranch(currentUser.getBranch());
        currentAccount.setValidateOff(false);
        currentAccount.setLocked(false);
        currentAccount.setAllowedTransferFrom(true);
        currentAccount.setAllowedTransferTo(true);
        currentAccount.setAllowedCashDeposit(true);
        currentAccount.setAllowedCashWithdrawal(true);
        currentAccount.setAllowedManualTransaction(true);
        return currentAccount;
    }
}
