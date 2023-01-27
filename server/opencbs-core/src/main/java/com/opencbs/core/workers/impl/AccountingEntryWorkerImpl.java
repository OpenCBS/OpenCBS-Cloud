package com.opencbs.core.workers.impl;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.dto.MultipleTransactionAmountDto;
import com.opencbs.core.accounting.dto.MultipleTransactionDto;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.User;
import com.opencbs.core.exceptions.AccountNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.officedocuments.services.PrintingFormService;
import com.opencbs.core.workers.AccountingEntryWorker;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class AccountingEntryWorkerImpl implements AccountingEntryWorker {

    private final AccountingEntryService accountingEntryService;
    private final AccountService accountService;
    private final PrintingFormService printingFormService;


    @Override
    public List<AccountingEntry> makeMultipleTransaction(MultipleTransactionDto multipleTransactionDto) {
        Account account = this.accountService.findOne(multipleTransactionDto.getAccountId())
                .orElseThrow(() -> new AccountNotFoundException(multipleTransactionDto.getAccountId()));
        User user = UserHelper.getCurrentUser();
        Branch branch = user.getBranch();
        return multipleTransactionDto.getAmounts().stream()
                .map(it -> createTransaction(multipleTransactionDto, account, user, branch, it))
                .collect(Collectors.toList());
    }

    @Override
    @SneakyThrows
    public ResponseEntity printReceipt(MultipleTransactionDto multipleTransactionDto) {
        HashMap<String, Object> data = new HashMap<>();

        return this.printingFormService.getDocumentBy(data, "fast_deposit_receipt");
    }

    private AccountingEntry createTransaction(MultipleTransactionDto multipleTransactionDto, Account account,
                                              User user, Branch branch, MultipleTransactionAmountDto transactionAmountDto) {
        Account secondAccount = this.accountService.findOne(transactionAmountDto.getAccountId())
                .orElseThrow(() -> new AccountNotFoundException(transactionAmountDto.getAccountId()));
        AccountingEntry accountingEntry = this.accountingEntryService.getAccountingEntry(multipleTransactionDto.getDateTime(),
                transactionAmountDto.getAmount(),
                (multipleTransactionDto.getAccountWillBeDebit()) ? account : secondAccount,
                (multipleTransactionDto.getAccountWillBeDebit()) ? secondAccount : account,
                branch,
                multipleTransactionDto.getDescription(),
                user,
                null
        );

        return accountingEntryService.save(accountingEntry);
    }
}