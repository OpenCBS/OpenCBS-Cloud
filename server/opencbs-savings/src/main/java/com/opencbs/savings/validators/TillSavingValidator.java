package com.opencbs.savings.validators;

import com.opencbs.core.accounting.validators.TillValidator;
import com.opencbs.core.annotations.Validator;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.savings.dto.OperationSavingDto;
import io.jsonwebtoken.lang.Assert;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class TillSavingValidator {

    private final TillValidator tillValidator;

    @Autowired
    public TillSavingValidator(TillValidator tillValidator) {
        this.tillValidator = tillValidator;
    }

    public void validateOperationSaving(OperationSavingDto dto) throws ResourceNotFoundException {
        this.tillValidator.validateOperation(dto);
        Assert.notNull(dto.getSavingId(), "Saving is required.");
    }
}