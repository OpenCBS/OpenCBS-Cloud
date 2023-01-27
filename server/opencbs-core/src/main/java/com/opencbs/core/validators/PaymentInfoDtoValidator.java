package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.dto.PaymentInfoDto;
import org.springframework.util.Assert;

@Validator
public class PaymentInfoDtoValidator {
    public void validate(PaymentInfoDto paymentInfoDto) {
        Assert.notNull(paymentInfoDto.getPaymentType(), "Payment type is required.");
        Assert.notNull(paymentInfoDto.getDate(), "Date is required.");
        Assert.notNull(paymentInfoDto.getTotal(), "Total is required.");
        Assert.isTrue(paymentInfoDto.getTotal().doubleValue() > 0, "The total must be greater than zero.");
    }
}
