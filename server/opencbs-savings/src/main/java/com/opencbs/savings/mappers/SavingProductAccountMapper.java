package com.opencbs.savings.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.savings.domain.SavingProduct;
import com.opencbs.savings.domain.SavingProductAccount;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import com.opencbs.savings.dto.SavingAccountDetailsDto;
import com.opencbs.savings.dto.SavingAccountDto;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper
public class SavingProductAccountMapper {
    private final AccountService accountService;
    private final AccountMapper accountMapper;

    public SavingProductAccountMapper(AccountService accountService,
                                      AccountMapper accountMapper) {
        this.accountService = accountService;
        this.accountMapper = accountMapper;
    }

    public List<SavingProductAccount> mapToEntity(SavingProduct product, SavingAccountDto dtos) {
        List<SavingProductAccount> loanProductAccounts = new ArrayList<>();
        SavingProductAccount productAccount;
        for (Map.Entry<SavingAccountRuleType, Long> entry : dtos.entrySet()) {
            productAccount = new SavingProductAccount();
            productAccount.setType(entry.getKey());
            productAccount.setAccount(this.accountService.findOne(entry.getValue()).get());
            productAccount.setProduct(product);
            loanProductAccounts.add(productAccount);
        }

        return loanProductAccounts
                .stream()
                .sorted(Comparator.comparing(SavingProductAccount::getType))
                .collect(Collectors.toList());
    }

    public SavingAccountDetailsDto mapToDto(List<SavingProductAccount> productAccount) {
        SavingAccountDetailsDto accountDetailsDto = new SavingAccountDetailsDto();
        productAccount.forEach(x ->
                        accountDetailsDto.put(x.getType(), this.accountMapper.mapToDetailsDto(x.getAccount())));
        return accountDetailsDto;
    }
}