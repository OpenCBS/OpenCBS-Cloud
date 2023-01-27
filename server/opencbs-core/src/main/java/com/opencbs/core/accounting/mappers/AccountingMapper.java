package com.opencbs.core.accounting.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.User;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.dto.AccountingEntryDto;
import com.opencbs.core.accounting.dto.AccountingTransactionExtDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.accounting.services.AccountService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class AccountingMapper {

    private final AccountService accountService;

    @Autowired
    public AccountingMapper(AccountService accountService) {
        this.accountService = accountService;
    }

    public AccountingEntryDto mapToDto(AccountingEntry entry) {
        AccountingEntryDto dto = new ModelMapper().map(entry, AccountingEntryDto.class);

        if(entry.getExtra() != null)
            dto.setDocumentNumber(entry.getExtra().values().stream().findFirst().get().toString());

        dto.setCreatedAt(entry.getCreatedAt());
        dto.setBranchName(entry.getBranch().getName());
        dto.setCreatedByFullName(String.format("%s %s", entry.getCreatedBy().getFirstName(), entry.getCreatedBy().getLastName()));

        return dto;
    }

    public AccountingEntry mapToEntity(AccountingTransactionExtDto dto, User user) throws ResourceNotFoundException {
        AccountingEntry accountingEntry = new AccountingEntry();
        accountingEntry.setDescription(dto.getDescription());
        accountingEntry.setAmount(dto.getAmount());
        accountingEntry.setCreatedAt(dto.getCreatedAt());
        accountingEntry.setEffectiveAt(dto.getCreatedAt());
        accountingEntry.setCreatedBy(user);
        accountingEntry.setBranch(user.getBranch());
        accountingEntry.setDeleted(false);
        Account debit = this.accountService
                .findOne(dto.getDebitAccountId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found (ID=%d).", dto.getDebitAccountId())));
        Account credit = this.accountService
                .findOne(dto.getCreditAccountId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found (ID=%d).", dto.getCreditAccountId())));
        accountingEntry.setDebitAccount(debit);
        accountingEntry.setCreditAccount(credit);
        return accountingEntry;
    }
}
