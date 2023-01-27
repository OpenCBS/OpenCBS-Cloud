package com.opencbs.core.validators;

import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Validator;
import com.opencbs.core.dto.penalty.PenaltyCreateDto;
import io.jsonwebtoken.lang.Assert;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;

@RequiredArgsConstructor
@Validator
public class PenaltyValidator {

    private final AccountService accountService;


    public void validate(PenaltyCreateDto dto) {
        Assert.isTrue(!StringUtils.isEmpty(dto.getName()), "Name is required.");
        Assert.isTrue(!StringUtils.isEmpty(dto.getName().trim()), "Name is required.");

        Assert.notNull(dto.getBeginPeriodDay(), "The start of the interval must be set");
        Assert.notNull(dto.getEndPeriodDay(), "The end of the interval must be set");
        Assert.isTrue(dto.getEndPeriodDay()-dto.getBeginPeriodDay()>0,"The end of the interval must be more start");
        Assert.isTrue(dto.getEndPeriodDay()-dto.getBeginPeriodDay()-dto.getGracePeriod()>=0,"Grace period value can be in the interval");
        Assert.notNull(dto.getPenalty(), "Penalty value can be set");

        this.validateAccount(dto.getAccrualAccountId(), "Accrual account is required or can be exist.");
        this.validateAccount(dto.getIncomeAccountId(), "Income account is required or can be exist.");
    }

    private void validateAccount(Long accountId, String errorMessage){
        Assert.notNull(accountId, errorMessage);
        Assert.isTrue(this.accountService.findOne(accountId).isPresent(), errorMessage);
    }
}
