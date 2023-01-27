package com.opencbs.core.validators.typevalidators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.customfields.CustomField;
import org.springframework.util.Assert;

@Validator
public class PatternFieldTypeValidator implements FieldTypeValidator{

    @Override
    public void validate(CustomField customField, String value) {
        String pattern = customField.getExtra().get("pattern").toString();
        Assert.hasText(pattern, "The `pattern` property not found in extra.");
        Assert.isTrue(value.matches(pattern), customField.getExtra().get("message").toString());
    }
}
