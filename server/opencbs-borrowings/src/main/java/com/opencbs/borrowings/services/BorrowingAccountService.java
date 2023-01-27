package com.opencbs.borrowings.services;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.BorrowingAccount;
import com.opencbs.borrowings.domain.BorrowingProduct;
import com.opencbs.borrowings.domain.BorrowingProductAccount;
import com.opencbs.borrowings.domain.enums.BorrowingRuleType;
import com.opencbs.borrowings.repositories.BorrowingAccountRepository;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.CustomAccountingService;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.enums.AccountType;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@ConditionalOnMissingBean(annotation = CustomAccountingService.class)
public class BorrowingAccountService {

    private final BorrowingAccountRepository borrowingAccountRepository;
    protected final BorrowingProductAccountService borrowingProductAccountService;
    protected final AccountService accountService;

    public BorrowingAccountService(BorrowingAccountRepository borrowingAccountRepository,
                                   BorrowingProductAccountService borrowingProductAccountService,
                                   AccountService accountService) {
        this.borrowingAccountRepository = borrowingAccountRepository;
        this.borrowingProductAccountService = borrowingProductAccountService;
        this.accountService = accountService;
    }

    @Transactional
    public List<BorrowingAccount> create(List<BorrowingAccount> borrowingAccounts) {
        return borrowingAccounts.stream()
                .map(this::create)
                .collect(Collectors.toList());
    }

    @Transactional
    public BorrowingAccount create(BorrowingAccount borrowingAccount) {
        return this.borrowingAccountRepository.save(borrowingAccount);
    }

    public List<BorrowingAccount> getAllByBorrowingId(Long borrowingId) {
        return this.borrowingAccountRepository.getAllByBorrowingId(borrowingId);
    }

    public void createBorrowingAccounts(Borrowing borrowing) {
        BorrowingProduct product = borrowing.getBorrowingProduct();
        List<BorrowingProductAccount> borrowingProductAccounts = this.borrowingProductAccountService
                .getAllByBorrowingProductId(product.getId());

        if (borrowingProductAccounts.size() != BorrowingRuleType.values().length)
            throw new RuntimeException("Accounts should be configured for the Borrowing Product");

        List<BorrowingAccount> borrowingAccounts = this.getAccountsFromBorrowingProduct(borrowingProductAccounts,
                borrowing, borrowing.getBorrowingProduct().getCurrency());

        for (BorrowingAccount borrowingAccount : borrowingAccounts) {
            this.create(this.checkIfExists(borrowingAccount));
        }
    }

    protected List<BorrowingAccount> getAccountsFromBorrowingProduct(List<BorrowingProductAccount> borrowingProductAccounts, Borrowing borrowing, Currency currency) {
        List<BorrowingAccount> borrowingAccounts = new ArrayList<>();
        for (BorrowingProductAccount borrowingProductAccount : borrowingProductAccounts) {
            BorrowingAccount borrowingAccount = new BorrowingAccount();
            Account parent = borrowingProductAccount.getAccount();
            Account account = parent.toBuilder().build();

            if (parent.getType() != AccountType.SUBGROUP && parent.getType() != AccountType.BALANCE){
                throw new RuntimeException(String.format("Account %s should be SUBGROUP or BALANCE", account.getNumber()));
            }

            if (parent.getType() == AccountType.SUBGROUP) {
                account = this.accountService.getBalanceAccount(parent, account, borrowing.getId(),
                        parent.getName(), borrowing.getProfile().getName(), borrowing.getCode());
            }
            account.setCurrency(currency);
            borrowingAccount.setAccount(account);
            borrowingAccount.setBorrowing(borrowing);
            borrowingAccount.setAccountRuleType(borrowingProductAccount.getBorrowingAccountRuleType());
            borrowingAccounts.add(borrowingAccount);
        }
        return borrowingAccounts;
    }

    protected BorrowingAccount checkIfExists(BorrowingAccount borrowingAccount) {
        Account account = borrowingAccount.getAccount();
        if (account.getId() == null) {
            Optional<Account> existAccount = this.accountService.findByNumberAndCurrencyIdAndBranchId(
                    account.getNumber(), account.getCurrency(), account.getBranch().getId());
            account = existAccount.orElseGet(() -> this.accountService.create(borrowingAccount.getAccount()));
        }
        borrowingAccount.setAccount(account);
        return borrowingAccount;
    }
}
