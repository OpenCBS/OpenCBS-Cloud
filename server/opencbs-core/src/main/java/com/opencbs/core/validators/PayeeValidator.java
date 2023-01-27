package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.dto.PayeeDto;
import com.opencbs.core.services.PayeeService;
import io.jsonwebtoken.lang.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

@Validator
public class PayeeValidator {

    private PayeeService payeeService;

    @Autowired
    public PayeeValidator(PayeeService payeeService) {
        this.payeeService = payeeService;
    }

    public void validateOnCreate(PayeeDto dto) {
        this.validate(dto);
        Assert.isTrue(!this.payeeService.findByName(dto.getName()).isPresent(), "Payee already exists.");
    }

    public void validateOnUpdate(PayeeDto dto) {
        this.validate(dto);
        if (this.payeeService.findByName(dto.getName()).isPresent())
            Assert.isTrue(this.payeeService.findByName(dto.getName()).get().getId().equals(dto.getId()), "Payee name must be unique.");
    }

    private void validate(PayeeDto dto) {
        Assert.notEmpty(dto.getCurrentAccounts(), "Account is required.");
        Assert.isTrue(!StringUtils.isEmpty(dto.getName()), "Name is required.");
        Assert.isTrue(!StringUtils.isEmpty(dto.getName().trim()), "Name is required.");
    }
}
