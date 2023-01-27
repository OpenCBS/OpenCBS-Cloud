package com.opencbs.core.mappers;

import com.opencbs.core.accounting.dto.AccountDto;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.TransactionTemplate;
import com.opencbs.core.domain.TransactionTemplateAccounts;
import com.opencbs.core.dto.TransactionTemplateDetailsDto;
import com.opencbs.core.dto.TransactionTemplateDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Mapper
public class TransactionTemplateMapper {

    private final AccountService accountService;
    private final AccountMapper accountMapper;

    public TransactionTemplate mapToEntity(TransactionTemplateDto transactionTemplateDto) {
        TransactionTemplate transactionTemplate = new TransactionTemplate();
        transactionTemplate.setName(transactionTemplateDto.getName());
        List<TransactionTemplateAccounts> transactionTemplateAccounts = new ArrayList<>();

        for (Long debitAccountId : transactionTemplateDto.getDebitAccounts()) {
            TransactionTemplateAccounts account = new TransactionTemplateAccounts();
            account.setTransactionTemplate(transactionTemplate);
            account.setAccountId(debitAccountId);
            account.setIsDebit(true);
            transactionTemplateAccounts.add(account);
        }

        for (Long creditAccountId : transactionTemplateDto.getCreditAccounts()) {
            TransactionTemplateAccounts account = new TransactionTemplateAccounts();
            account.setTransactionTemplate(transactionTemplate);
            account.setAccountId(creditAccountId);
            account.setIsDebit(false);
            transactionTemplateAccounts.add(account);
        }

        transactionTemplate.setAccounts(transactionTemplateAccounts);
        return transactionTemplate;
    }

    public TransactionTemplateDetailsDto mapToDto(TransactionTemplate transactionTemplate) {
        TransactionTemplateDetailsDto transactionTemplateDetailsDto = new ModelMapper().map(transactionTemplate, TransactionTemplateDetailsDto.class);
        List<TransactionTemplateAccounts> transactionTemplateAccounts = transactionTemplate.getAccounts();
        List<AccountDto> debitAccounts = new ArrayList<>();
        List<AccountDto> creditAccounts = new ArrayList<>();

        for (TransactionTemplateAccounts debitAccount : transactionTemplateAccounts.stream().filter(x -> x.getIsDebit().equals(true)).collect(Collectors.toList())) {
            AccountDto accountDto = this.accountMapper.mapToDto(this.accountService.findOne(debitAccount.getAccountId()).get());
            accountDto.setIsTemplateDebit(debitAccount.getIsDebit());
            debitAccounts.add(accountDto);
        }

        for (TransactionTemplateAccounts creditAccount : transactionTemplateAccounts.stream().filter(x -> x.getIsDebit().equals(false)).collect(Collectors.toList())) {
            AccountDto accountDto = this.accountMapper.mapToDto(this.accountService.findOne(creditAccount.getAccountId()).get());
            accountDto.setIsTemplateDebit(creditAccount.getIsDebit());
            creditAccounts.add(accountDto);
        }

        transactionTemplateDetailsDto.setDebitAccounts(debitAccounts);
        transactionTemplateDetailsDto.setCreditAccounts(creditAccounts);
        return transactionTemplateDetailsDto;
    }
}
