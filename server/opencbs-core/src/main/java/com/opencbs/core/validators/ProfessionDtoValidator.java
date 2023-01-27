package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.services.ProfessionService;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class ProfessionDtoValidator extends TreeEntityDtoValidator<ProfessionService> {

    @Autowired
    public ProfessionDtoValidator(ProfessionService service) {
        super(service);
    }
}
