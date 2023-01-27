package com.opencbs.core.validators.typevalidators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.helpers.NumericHelper;
import org.springframework.util.Assert;

@Validator
public class NumericFieldTypeValidator implements FieldTypeValidator{

    @Override
    public void validate(CustomField customField, String value) {
        Assert.isTrue(NumericHelper.isValidInt(value), String.format("Value '%s' is not a valid number.", value));
    }
}
