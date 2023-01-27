package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.services.BusinessSectorService;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class BusinessSectorValidator extends TreeEntityDtoValidator<BusinessSectorService> {
    @Autowired
    public BusinessSectorValidator(BusinessSectorService service) {
        super(service);
    }
}
