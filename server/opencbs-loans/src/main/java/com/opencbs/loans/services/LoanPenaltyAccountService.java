package com.opencbs.loans.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountCreatorInterface;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.loans.domain.LoanApplicationPenalty;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanPenaltyAccount;
import com.opencbs.loans.repositories.LoanPenaltyAccountRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class LoanPenaltyAccountService {

    public static final String PENALTY_NAME_KEY = "penalty_name_key";

    private final AccountService accountService;
    private final AccountingEntryService accountingEntryService;
    private final LoanPenaltyAccountRepository loanPenaltyAccountRepository;


    public LoanPenaltyAccount createLoanPenaltyAccount(LoanApplicationPenalty loanApplicationPenalty) {
        LoanPenaltyAccount loanPenaltyAccount = new LoanPenaltyAccount();
        loanPenaltyAccount.setLoanApplicationPenalty(loanApplicationPenalty);

        loanPenaltyAccount.setAccrualAccount(
                this.createAccount(loanApplicationPenalty.getAccrualAccount(),
                    String.format("Penalty accrual account for %s", loanApplicationPenalty.getName()),
                    loanApplicationPenalty.getId()
                )
        );

        loanPenaltyAccount.setIncomeAccount(
                this.createAccount(loanApplicationPenalty.getIncomeAccount(),
                    String.format("Penalty income account %s", loanApplicationPenalty.getName()),
                    loanApplicationPenalty.getId()
                )
        );

        loanPenaltyAccount.setWriteOffAccount(
                this.createAccount(loanApplicationPenalty.getWriteOffAccount(),
                        String.format("Penalty write-off account %s", loanApplicationPenalty.getName()),
                        loanApplicationPenalty.getId()
                )
        );

        return loanPenaltyAccount;
    }

    private Account createAccount(Account account, String name, Long penaltyId) {
        if ( !(account.getType() == AccountType.BALANCE || account.getType() == AccountType.SUBGROUP) ){
                throw new RuntimeException(String.format("Account %s should be %s or %s", account.getNumber(), AccountType.BALANCE.toString(), AccountType.SUBGROUP.toString()));
        }

        if (AccountType.BALANCE == account.getType()) {
            return account;
        }

        Account newAccount = account.toBuilder().build();
        newAccount = this.accountService.getBalanceAccount(account, newAccount, new AccountCreatorInterface() {
            @Override
            public String getName() {
                return name;
            }

            @Override
            public String getNumber() {
                return String.format("%s%s", account.getNumber(), String.format("%06d", penaltyId));
            }
        });

        return newAccount;
    }

    public List<LoanPenaltyAccount> getPenaltyAccountsByLoanId(@NonNull Long loanId) {
        LoanPenaltyAccount pattern = new LoanPenaltyAccount();
        pattern.setLoanId(loanId);
        return this.loanPenaltyAccountRepository.findAll(Example.of(pattern));
    }

    public void createWriteOffPenaltyAccountingEntry(LoanApplicationPenalty loanApplicationPenalty, LoanEvent event) {
        Account debitAccount = loanApplicationPenalty.getWriteOffAccount();
        Account creditAccount = loanApplicationPenalty.getAccrualAccount();
        User currentUser = UserHelper.getCurrentUser();
        AccountingEntry accountingEntry = this.accountingEntryService.getAccountingEntry(event.getEffectiveAt(),event.getAmount(), debitAccount,
                creditAccount, currentUser.getBranch(), event.getComment(), currentUser, null);
        accountingEntry.setCreatedAt(event.getCreatedAt());
        this.accountingEntryService.create(accountingEntry);
    }
}
