package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.validators.TreeEntityDtoValidator;
import com.opencbs.loans.services.LoanPurposeService;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class LoanPurposeValidator extends TreeEntityDtoValidator<LoanPurposeService> {
    @Autowired
    public LoanPurposeValidator(LoanPurposeService service) {
        super(service);
    }
}
