package com.opencbs.core.accounting.validators;

import com.opencbs.core.accounting.dto.AccountingTransactionDto;
import com.opencbs.core.accounting.dto.AccountingTransactionExtDto;
import com.opencbs.core.accounting.dto.MultipleTransactionAmountDto;
import com.opencbs.core.accounting.dto.MultipleTransactionDto;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.Map;

@RequiredArgsConstructor
@Validator
public class AccountingValidator {

    public void validateOnTransfer(AccountingTransactionDto dto) {
        this.validate(dto);
        Assert.notNull(dto.getAccountId(), "Account is required");
    }

    public void validateOnCreate(AccountingTransactionExtDto dto){
        this.validate(dto);
        Assert.isTrue(dto.getDebitAccountId().compareTo(dto.getCreditAccountId()) != 0, "Accounts should be different");
    }

    private void validate(AccountingTransactionDto dto){
        Assert.notNull(dto.getAmount(), "Amount is required");
        Assert.isTrue(dto.getAmount().compareTo(BigDecimal.ZERO) > 0, "Amount should be greater than zero");
        Assert.notNull(dto.getDescription(), "Description is required");
        Assert.isTrue(dto.getDescription().length() <= 255, "Number of characters in description have to be less than 255");
    }
}