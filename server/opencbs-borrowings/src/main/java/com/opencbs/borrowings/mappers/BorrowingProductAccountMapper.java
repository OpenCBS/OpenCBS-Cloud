package com.opencbs.borrowings.mappers;

import com.opencbs.borrowings.domain.enums.BorrowingRuleType;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.borrowings.domain.BorrowingProduct;
import com.opencbs.borrowings.domain.BorrowingProductAccount;
import com.opencbs.borrowings.dto.BorrowingProductAccountDetailsDto;
import com.opencbs.borrowings.dto.BorrowingProductAccountDto;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper
public class BorrowingProductAccountMapper {

    private final AccountService accountService;
    private final AccountMapper accountMapper;

    public BorrowingProductAccountMapper(AccountService accountService,
                                         AccountMapper accountMapper) {
        this.accountService = accountService;
        this.accountMapper = accountMapper;
    }

    public List<BorrowingProductAccount> mapToEntity(BorrowingProduct product, BorrowingProductAccountDto dtos) {
        List<BorrowingProductAccount> loanProductAccounts = new ArrayList<>();
        for (Map.Entry<BorrowingRuleType, Long> entry : dtos.entrySet()) {
            BorrowingProductAccount loanProductAccount = new BorrowingProductAccount();
            loanProductAccount.setBorrowingAccountRuleType(entry.getKey());
            loanProductAccount.setAccount(this.accountService.findOne(entry.getValue()).get());
            loanProductAccount.setBorrowingProduct(product);
            loanProductAccounts.add(loanProductAccount);
        }
        return loanProductAccounts
                .stream()
                .sorted(Comparator.comparing(BorrowingProductAccount::getBorrowingAccountRuleType))
                .collect(Collectors.toList());
    }

    public BorrowingProductAccountDetailsDto mapToDto(BorrowingProductAccount loanProductAccount) {
        BorrowingProductAccountDetailsDto detailsDto = new ModelMapper()
                .map(loanProductAccount, BorrowingProductAccountDetailsDto.class);
        detailsDto.setAccountDto(this.accountMapper.mapToDto(loanProductAccount.getAccount()));
        return detailsDto;
    }
}