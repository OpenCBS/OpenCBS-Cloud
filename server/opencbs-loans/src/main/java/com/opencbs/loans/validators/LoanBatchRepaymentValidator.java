package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.enums.ProfileType;
import com.opencbs.loans.domain.LoanApplication;
import io.jsonwebtoken.lang.Assert;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class LoanBatchRepaymentValidator {

    @Autowired
    public LoanBatchRepaymentValidator(){}

    public void validate(LoanApplication loanApplication){
        Assert.isTrue(loanApplication.getProfile().getType().equals(ProfileType.GROUP.toString()), "Application must be GROUP type.");
    }
}
