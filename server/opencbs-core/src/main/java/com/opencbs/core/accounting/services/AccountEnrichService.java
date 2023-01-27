package com.opencbs.core.accounting.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountBalance;
import com.opencbs.core.accounting.domain.ExtendedAccount;
import com.opencbs.core.accounting.domain.ExtendedAccountWithBalance;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.User;
import lombok.NonNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountEnrichService {

    private final AccountService accountService;
    private final AccountBalanceService accountBalanceService;

    @Autowired
    public AccountEnrichService(AccountService accountService,
                                AccountBalanceService accountBalanceService) {
        this.accountService = accountService;
        this.accountBalanceService = accountBalanceService;
    }

    public List<ExtendedAccountWithBalance> enrichWithBalance(LocalDateTime dateTime, User currentUser) {
        List<Account> rootAccounts = accountService.findRootAccounts()
                .stream()
                .sorted(Comparator.comparing(Account::getNumber))
                .collect(Collectors.toList());

        List<AccountBalance> accountBalances = this.accountBalanceService.getAccountBalances(rootAccounts
                .stream()
                .map(BaseEntity::getId)
                .collect(Collectors.toList()), dateTime);

        return this.mapToExtendedAccountWithBalance(rootAccounts, accountBalances);
    }

    public Page<ExtendedAccountWithBalance> findLeavesWithBalanceByParent(Pageable pageable, Account account, @NonNull LocalDateTime dateTime, User user) {
        Page<Account> leavesByParent = this.accountService.findLeavesByParent(pageable, account);
        List<Account> accounts = leavesByParent.getContent();
        List<AccountBalance> accountBalances = this.accountBalanceService.getAccountBalances(
                accounts.stream()
                        .map(BaseEntity::getId)
                        .collect(Collectors.toList()), dateTime);
        List<ExtendedAccountWithBalance> extendedAccountWithBalances =
                this.mapToExtendedAccountWithBalance(accounts, accountBalances)
                        .stream()
                        .sorted(Comparator.comparing(ExtendedAccountWithBalance::getNumber))
                        .collect(Collectors.toList());
        return new PageImpl<>(extendedAccountWithBalances, pageable, leavesByParent.getTotalElements());
    }

    //Moved from other service
    /// TODO need refactoring because full TRASH and UGAR
    private List<ExtendedAccountWithBalance> mapToExtendedAccountWithBalance(List<Account> accounts, List<AccountBalance> accountBalances) {
        ModelMapper modelMapper = new ModelMapper();

        return accounts.stream()
                .map(x -> {
                    ExtendedAccount ea = modelMapper.map(x, ExtendedAccount.class);
                    ea.setHasChildren(x.getHasChildren());
                    return ea;
                })
                .map(x -> {
                    ExtendedAccountWithBalance extendedAccountWithBalance = modelMapper.map(x, ExtendedAccountWithBalance.class);
                    Optional<AccountBalance> first = accountBalances
                            .stream()
                            .filter(t -> t.getAccountId().equals(x.getId())).findFirst();
                    if (first.isPresent()) {
                        extendedAccountWithBalance.setBalance(first.get().getBalance());
                        return extendedAccountWithBalance;
                    }
                    extendedAccountWithBalance.setBalance(BigDecimal.ZERO);
                    return extendedAccountWithBalance;
                })
                .collect(Collectors.toList());
    }
}
