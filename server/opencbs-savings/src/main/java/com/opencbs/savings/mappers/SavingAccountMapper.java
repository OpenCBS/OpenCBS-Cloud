package com.opencbs.savings.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.savings.domain.SavingAccount;
import com.opencbs.savings.dto.SavingAccountDetailsDto;

import java.util.List;

@Mapper
public class SavingAccountMapper {
    private final AccountMapper accountMapper;

    public SavingAccountMapper(AccountMapper accountMapper) {
        this.accountMapper = accountMapper;
    }

    public SavingAccountDetailsDto mapToDto(List<SavingAccount> savingAccount) {
        if (savingAccount == null) {
            return null;
        }
        SavingAccountDetailsDto accountDetailsDto = new SavingAccountDetailsDto();
        savingAccount.forEach(x ->
                accountDetailsDto.put(x.getType(), this.accountMapper.mapToDetailsDto(x.getAccount())));
        return accountDetailsDto;
    }
}