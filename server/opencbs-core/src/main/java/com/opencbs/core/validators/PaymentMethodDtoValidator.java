package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.services.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class PaymentMethodDtoValidator extends TreeEntityDtoValidator<PaymentMethodService> {

    @Autowired
    public PaymentMethodDtoValidator(PaymentMethodService service) {
        super(service);
    }
}
