package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.trees.PaymentMethod;
import com.opencbs.core.services.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class PaymentMethodMapper extends TreeEntityMapper<PaymentMethodService, PaymentMethod> {

    @Autowired
    public PaymentMethodMapper(PaymentMethodService service) {
        super(service, PaymentMethod.class);
    }
}
