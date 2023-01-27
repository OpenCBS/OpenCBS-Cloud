package com.opencbs.core.accounting.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.accounting.dto.AccountCreateDto;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.validators.BaseValidator;
import org.springframework.util.Assert;

import java.util.Optional;

@Validator
public class AccountValidator extends BaseValidator {

    private final AccountService accountService;

    public AccountValidator(AccountService accountService) {
        this.accountService = accountService;
    }

    public void validate(AccountCreateDto dto) {
        this.stringIsNotEmpty(dto.getName(), "Name is required.");
        this.stringIsNotEmpty(dto.getParentNumber() + dto.getChildNumber(), "Number is required.");
        Assert.notNull(dto.getIsDebit(), "Account should be debit or credit.");
        Assert.notNull(dto.getBranchId(), "Branch is required.");
    }

    public void validateOnCreate(AccountCreateDto dto) {
        this.validate(dto);
        Assert.isTrue(!this.accountService.findByNumber(dto.getParentNumber() + dto.getChildNumber()).isPresent(), "Number (" + dto.getParentNumber() + dto.getChildNumber() + ") has been taken.");
    }

    public void validateOnUpdate(AccountCreateDto dto, Account account) {
        this.validate(dto);
        if (account.getType().equals(AccountType.BALANCE)) {
            Assert.notNull(dto.getCurrencyId(), "For balance account currency is required.");
        }
        Optional<Account> accountByNumber = this.accountService.findByNumber(dto.getParentNumber() + dto.getChildNumber());
        accountByNumber.ifPresent(account1 -> Assert.isTrue(account1.equals(account), "Number (" + dto.getParentNumber() + dto.getChildNumber() + ") has been taken."));
    }
}
