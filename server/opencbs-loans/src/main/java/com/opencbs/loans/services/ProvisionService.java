package com.opencbs.loans.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.AccountRuleType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.loans.domain.*;
import com.opencbs.loans.domain.enums.ProvisionType;
import com.opencbs.loans.repositories.LoanSpecificProvisionRepository;
import com.opencbs.loans.services.loancloseday.provisions.ProvisionProcessor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor

@Lazy
@Service
public class ProvisionService {

    private final AccountingEntryService accountingEntryService;
    private final AccountService accountService;
    private final LoanAccountService loanAccountService;
    private final List<ProvisionProcessor> provisionProcessors;
    private final LoanService loanService;
    private final LoanSpecificProvisionRepository loanSpecificProvisionRepository;

    private Account getAccountByType(List<LoanAccount> loanAccounts, AccountRuleType accountRuleType) {
        for (LoanAccount loanAccount: loanAccounts){
            if (accountRuleType.equals(loanAccount.getAccountRuleType())) {
                return loanAccount.getAccount();
            }
        }

        throw new IllegalArgumentException(String.format("Not found account for type: %s", accountRuleType));
    }

    public void createReserve(@NonNull Long loanId, BigDecimal reserve, LocalDateTime localDateTime, ProvisionProcessor provisionProcessor) {
        final List<LoanAccount> loanAccounts = this.loanAccountService.getAllByLoanId(loanId);
        final BigDecimal currentReserve = this.accountService.getAccountBalance(
                this.getAccountByType(loanAccounts, provisionProcessor.getReserveAccountType()).getId(), localDateTime);

        if(currentReserve.compareTo(reserve)==0) {
            return;
        }

        Account creditAccount =  this.getAccountByType(loanAccounts, provisionProcessor.getReserveAccountType());
        Account debitAccount = this.getAccountByType(loanAccounts, provisionProcessor.getProvisionAccountType());
        String comment = provisionProcessor.getIncreaseComment();
        BigDecimal diff = reserve.subtract(currentReserve);
        if (BigDecimal.ZERO.compareTo(diff) > 0) {
            creditAccount = this.getAccountByType(loanAccounts, provisionProcessor.getReversalProvisionAccountType());
            debitAccount = this.getAccountByType(loanAccounts, provisionProcessor.getReserveAccountType());
            comment = provisionProcessor.getDecreaseComment();
            diff = diff.abs();
        }

        User currentUser = UserHelper.getCurrentUser();
        AccountingEntry accountingEntry = AccountingEntry.builder()
                .debitAccount(debitAccount)
                .creditAccount(creditAccount)
                .amount(diff)
                .branch(currentUser.getBranch())
                .effectiveAt(localDateTime)
                .description(comment)
                .createdBy(currentUser)
                .createdAt(DateHelper.getLocalDateTimeNow())
                .build();

        this.accountingEntryService.create(accountingEntry);
    }

    public void createReserve(Loan loan, LoanInfo loanInfo, ProvisionProcessor provisionProcessor, LocalDateTime date) {
        final List<LoanProductProvision> provisions = loan.getLoanApplication().getLoanProduct().getProvisions();
        final BigDecimal reserve = provisionProcessor.calculate(provisions, loanInfo);
        this.createReserve(loan.getId(), reserve, date, provisionProcessor);
    }

    public void createReserveByLoanId(Long loanId, LocalDateTime dateTime) {
        final List<LoanProductProvision> provisions = this.loanService.getLoanById(loanId).getLoanApplication().getLoanProduct().getProvisions();
        this.provisionProcessors.forEach(provisionProcessor -> {
            if( Long.valueOf(0L).compareTo(this.getCountOfSpecificProvisions(loanId, provisionProcessor.getType()))==0){
                LoanInfo loanInfo = this.loanService.getLoanInfo(loanId, dateTime.toLocalDate());
                final BigDecimal reserve = provisionProcessor.calculate(provisions, loanInfo);
                this.createReserve(loanId, reserve, dateTime, provisionProcessor);
            }
        });
    }

    private Long getCountOfSpecificProvisions(@NonNull Long loanId, ProvisionType provisionType) {
        LoanSpecificProvision loanSpecificProvision = LoanSpecificProvision.builder()
                .loanId(loanId)
                .provisionType(provisionType)
                .build();
        return this.loanSpecificProvisionRepository.count(Example.of(loanSpecificProvision));
    }
}
