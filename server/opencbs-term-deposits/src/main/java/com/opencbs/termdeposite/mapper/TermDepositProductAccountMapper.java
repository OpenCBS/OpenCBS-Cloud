package com.opencbs.termdeposite.mapper;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.termdeposite.domain.enums.TermDepositAccountType;
import com.opencbs.termdeposite.domain.TermDepositProduct;
import com.opencbs.termdeposite.domain.TermDepositProductAccount;
import com.opencbs.termdeposite.dto.TermDepositProductAccountDetailsDto;
import com.opencbs.termdeposite.dto.TermDepositProductAccountDto;
import lombok.NonNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper
public class TermDepositProductAccountMapper {

    private final AccountService accountService;

    private final AccountMapper accountMapper;

    @Autowired
    public TermDepositProductAccountMapper(@NonNull AccountService accountService,
                                           @NonNull AccountMapper accountMapper) {
        this.accountService = accountService;
        this.accountMapper = accountMapper;
    }

    public List<TermDepositProductAccount> mapToEntity(TermDepositProduct product, TermDepositProductAccountDto dtos) {
        List<TermDepositProductAccount> termDepositProductAccounts = new ArrayList<>();
        TermDepositProductAccount productAccount;
        for (Map.Entry<TermDepositAccountType, Long> entry : dtos.entrySet()) {
            productAccount = new TermDepositProductAccount();
            productAccount.setType(entry.getKey());
            productAccount.setAccount(this.accountService.findOne(entry.getValue()).get());
            productAccount.setProduct(product);
            termDepositProductAccounts.add(productAccount);
        }

        return termDepositProductAccounts
                .stream()
                .sorted(Comparator.comparing(TermDepositProductAccount::getType))
                .collect(Collectors.toList());
    }

    public TermDepositProductAccountDetailsDto mapToDto(TermDepositProductAccount account) {
        TermDepositProductAccountDetailsDto accountDetailsDto = new ModelMapper()
                .map(account, TermDepositProductAccountDetailsDto.class);
        accountDetailsDto.setAccountRuleType(account.getType());
        accountDetailsDto.setAccountDto(this.accountMapper.mapToDetailsDto(account.getAccount()));
        return accountDetailsDto;
    }
}