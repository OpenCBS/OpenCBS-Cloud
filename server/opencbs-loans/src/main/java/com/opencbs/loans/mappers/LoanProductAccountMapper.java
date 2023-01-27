package com.opencbs.loans.mappers;

import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.enums.AccountRuleType;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.domain.products.LoanProductAccount;
import com.opencbs.loans.dto.products.LoanProductAccountDetailsDto;
import com.opencbs.loans.dto.products.ProductAccountDto;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Mapper
public class LoanProductAccountMapper {

    private final AccountService accountService;
    private final AccountMapper accountMapper;

    public LoanProductAccountMapper(AccountService accountService,
                                    AccountMapper accountMapper) {
        this.accountService = accountService;
        this.accountMapper = accountMapper;
    }

    public List<LoanProductAccount> mapToEntity(LoanProduct product, ProductAccountDto dtos) {
        List<LoanProductAccount> loanProductAccounts = new ArrayList<>();
        for (Map.Entry<AccountRuleType, Long> entry : dtos.entrySet()) {
            LoanProductAccount loanProductAccount = new LoanProductAccount();
            loanProductAccount.setAccountRuleType(entry.getKey());
            loanProductAccount.setAccount(this.accountService.findOne(entry.getValue()).get());
            loanProductAccount.setLoanProduct(product);
            loanProductAccounts.add(loanProductAccount);
        }
        return loanProductAccounts;
    }

    public LoanProductAccountDetailsDto mapToDto(LoanProductAccount loanProductAccount) {
        LoanProductAccountDetailsDto detailsDto = new ModelMapper()
                .map(loanProductAccount, LoanProductAccountDetailsDto.class);
        if (loanProductAccount.getAccount()!=null) {
            detailsDto.setAccountDto(this.accountMapper.mapToDto(loanProductAccount.getAccount()));
        }
        return detailsDto;
    }
}