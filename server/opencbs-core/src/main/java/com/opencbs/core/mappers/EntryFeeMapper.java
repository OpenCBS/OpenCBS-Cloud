package com.opencbs.core.mappers;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.EntryFee;
import com.opencbs.core.dto.CreateEntryFeeDto;
import com.opencbs.core.dto.EntryFeeMainDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

@Mapper
@RequiredArgsConstructor
public class EntryFeeMapper {

    private final AccountService accountService;
    private final AccountMapper accountMapper;


    public EntryFee mapToEntity(CreateEntryFeeDto dto){
        Account account = this.accountService.findOne(dto.getAccountId()).get();
        EntryFee entryFee = new ModelMapper().map(dto, EntryFee.class);
        entryFee.setAccount(account);

        return entryFee;
    }

    public EntryFeeMainDto mapToDto(EntryFee entryFee) {
        EntryFeeMainDto dto = new ModelMapper().map(entryFee, EntryFeeMainDto.class);
        dto.setAccount(this.accountMapper.mapToDetailsDto(entryFee.getAccount()));
        return dto;
    }
}
