package com.opencbs.loans.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.CustomLoanAccountService;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.enums.AccountRuleType;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanAccount;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.domain.products.LoanProductAccount;
import com.opencbs.loans.repositories.LoanAccountRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@ConditionalOnMissingBean(annotation = CustomLoanAccountService.class)
public class LoanAccountService {

    private final LoanAccountRepository loanAccountRepository;
    protected final LoanProductAccountService loanProductAccountService;
    protected final AccountService accountService;
    protected final CurrencyService currencyService;

    public LoanAccountService(LoanAccountRepository loanAccountRepository,
                              LoanProductAccountService loanProductAccountService,
                              AccountService accountService,
                              CurrencyService currencyService) {
        this.loanAccountRepository = loanAccountRepository;
        this.loanProductAccountService = loanProductAccountService;
        this.accountService = accountService;
        this.currencyService = currencyService;
    }

    @Transactional
    public List<LoanAccount> create(List<LoanAccount> loanAccount) {
        return loanAccount.stream()
                .map(this::create)
                .collect(Collectors.toList());
    }

    @Transactional
    public LoanAccount create(LoanAccount loanAccount) {
        return this.loanAccountRepository.save(loanAccount);
    }

    public List<LoanAccount> getAllByLoanId(Long loanId) {
        return this.loanAccountRepository.getAllByLoanId(loanId);
    }

    public void createLoanAccounts(Loan loan) throws ResourceNotFoundException {
        LoanProduct product = loan.getLoanApplication().getLoanProduct();
        List<LoanProductAccount> loanProductAccounts = this.loanProductAccountService.getAllByLoanProductId(product.getId());

        if (loanProductAccounts.size() != AccountRuleType.values().length)
            throw new RuntimeException(String.format("Accounts should be configured for the %s Loan Product", product.getName()));

        Currency currency = this.currencyService.findOne(loan.getCurrencyId()).get();
        List<LoanAccount> loanAccounts = this.getAccountsFromLoanProduct(loanProductAccounts, loan, currency);

        for (LoanAccount loanAccount : loanAccounts) {
            this.create(this.checkIfExists(loanAccount));
        }
    }

    protected List<LoanAccount> getAccountsFromLoanProduct(List<LoanProductAccount> loanProductAccounts, Loan loan, Currency currency) {
        List<LoanAccount> loanAccounts = new ArrayList<>();
        for (LoanProductAccount loanProductAccount : loanProductAccounts) {
            LoanAccount loanAccount = new LoanAccount();
            Account parent = loanProductAccount.getAccount();

            if (parent.getType() != AccountType.SUBGROUP && parent.getType() != AccountType.BALANCE)
                throw new RuntimeException(String.format("Account %s should be %s or %s", parent.getNumber(), AccountType.BALANCE.toString(), AccountType.SUBGROUP.toString()));

            loanAccount.setLoan(loan);
            loanAccount.setAccountRuleType(loanProductAccount.getAccountRuleType());

            if (AccountType.BALANCE.equals(parent.getType())) {
                loanAccount.setAccount(parent);
                loanAccounts.add(loanAccount);
                continue;
            }

            String number = String.format("%s%s", parent.getNumber(), String.format("%06d", loan.getId()));
            Optional<Account> existedAccount = this.accountService.findByNumber(number);
            Account newAccount = parent.toBuilder().build();

            if (existedAccount.isPresent()) {
                newAccount = existedAccount.get();
            } else {
                newAccount = this.accountService.getBalanceAccount(parent, newAccount, loan.getId(),
                        parent.getName(), loan.getLoanApplication().getProfile().getName(), loan.getCode());
                newAccount.setCurrency(currency);
            }
            loanAccount.setAccount(newAccount);
            loanAccounts.add(loanAccount);
        }
        return loanAccounts;
    }

    protected LoanAccount checkIfExists(LoanAccount loanAccount) {
        Account account = loanAccount.getAccount();
        if (account.getId() == null) {
            Optional<Account> existAccount = this.accountService.findByNumberAndCurrencyIdAndBranchId(
                    account.getNumber(), account.getCurrency(), account.getBranch().getId());
            account = existAccount.orElseGet(() -> this.accountService.create(loanAccount.getAccount()));
        }
        loanAccount.setAccount(account);
        return loanAccount;
    }
}