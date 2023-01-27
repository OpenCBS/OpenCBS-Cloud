package com.opencbs.termdeposite.services.impl;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.termdeposite.annotaions.CustomTermDepositAccountGenerator;
import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.domain.TermDepositAccount;
import com.opencbs.termdeposite.domain.enums.TermDepositAccountType;
import com.opencbs.termdeposite.repositories.TermDepositAccountRepository;
import com.opencbs.termdeposite.services.TermDepositAccountingService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@ConditionalOnMissingBean(annotation = CustomTermDepositAccountGenerator.class)
public class TermDepositAccountingServiceImpl implements TermDepositAccountingService {

    private final AccountService accountService;
    private final TermDepositAccountRepository termDepositAccountRepository;


    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TermDepositAccount> createAccounts(TermDeposit termDeposit) {
        if (termDeposit.getTermDepositProduct().getTermDepositAccountList().size() != TermDepositAccountType.values().length) {
            throw new RuntimeException("Accounts should be configured in the Term Deposit Product");
        }

        return termDeposit.getTermDepositProduct().getTermDepositAccountList().stream()
                .filter(account ->
                        !termDepositAccountRepository.findByTermDepositAndTypeAndAccount(
                                termDeposit.getId(),
                                account.getType(),
                                account.getAccount().getId()).isPresent()
                )
                .map(x -> getTermDepositAccount(termDeposit, x.getAccount(), x.getType()))
                .collect(Collectors.toList());
    }

    @Override
    public Account getAccountByType(List<TermDepositAccount> accounts, TermDepositAccountType type) {
        TermDepositAccount termDepositAccount = accounts
                .stream()
                .filter(x -> x.getType().equals(type))
                .findFirst()
                .orElseThrow(() -> new RuntimeException(String.format("Account is not found by account type (%s).", type.toString())));
        return termDepositAccount.getAccount();
    }

    private TermDepositAccount getTermDepositAccount(TermDeposit termDeposit, Account account, TermDepositAccountType type) {
        if (this.checkOfValidAccount(account)) {
            throw new RuntimeException(String.format("Account %s should be SUBGROUP or BALANCE", account.getNumber()));
        }

        TermDepositAccount termDepositAccount = new TermDepositAccount();
        termDepositAccount.setTermDeposit(termDeposit);
        termDepositAccount.setType(type);
        if (account.getType().equals(AccountType.BALANCE)) {
            termDepositAccount.setAccount(account);
            return termDepositAccount;
        }

        String number = String.format("%s%s", account.getNumber(), String.format("%06d", termDeposit.getId()));
        Optional<Account> existedAccount = this.accountService.findByNumber(number);
        if (existedAccount.isPresent()) {
            termDepositAccount.setAccount(existedAccount.get());
            return termDepositAccount;
        }

        Account newAccount = account.toBuilder().build();
        newAccount = this.accountService.getBalanceAccount(account, newAccount, termDeposit.getId(),
                account.getName(), termDeposit.getProfile().getName(), termDeposit.getCode());
        newAccount.setCurrency(termDeposit.getTermDepositProduct().getCurrency());
        termDepositAccount.setAccount(newAccount);
        return termDepositAccount;
    }

    private boolean checkOfValidAccount(Account account) {
        return account.getType() != AccountType.SUBGROUP && account.getType() != AccountType.BALANCE;
    }
}
