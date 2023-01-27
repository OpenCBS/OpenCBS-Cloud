package com.opencbs.core.validators.typevalidators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.helpers.DateHelper;
import org.springframework.util.Assert;

@Validator
public class DateFieldTypeValidator implements FieldTypeValidator{

    @Override
    public void validate(CustomField customField, String value) {
        Assert.isTrue(DateHelper.isValidDate(value), String.format("Value '%s' is not a valid date.", value));
    }
}
