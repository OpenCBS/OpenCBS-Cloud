package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Payee;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.dto.PayeeDetailsDto;
import com.opencbs.core.dto.PayeeDto;
import com.opencbs.core.accounting.services.AccountService;
import org.modelmapper.ModelMapper;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper
public class PayeeMapper {

    private final AccountService accountService;

    public PayeeMapper(AccountService accountService) {
        this.accountService = accountService;
    }

    public Payee mapToEntity(PayeeDto dto) {
        Payee payee = new ModelMapper().map(dto, Payee.class);
        Set<Account> accountSet = dto.getCurrentAccounts()
                .stream()
                .map(x -> this.accountService.findOne(x).get())
                .collect(Collectors.toSet());
        payee.setPayeeAccounts(accountSet);
        return payee;
    }

    public PayeeDetailsDto mapToDto(Payee payee) {
        ModelMapper mapper = new ModelMapper();
        PayeeDetailsDto dto = mapper.map(payee, PayeeDetailsDto.class);
        dto.setAccountName(payee.getPayeeAccounts().iterator().next().getName());
        dto.setAccountNumber(payee.getPayeeAccounts().iterator().next().getNumber());
        dto.setAccountId(payee.getPayeeAccounts().iterator().next().getId());
        return dto;
    }
}
