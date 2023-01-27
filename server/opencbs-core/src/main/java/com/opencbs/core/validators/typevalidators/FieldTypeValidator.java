package com.opencbs.core.validators.typevalidators;

import com.opencbs.core.domain.customfields.CustomField;

public interface FieldTypeValidator {

    void validate(CustomField customField, String value);
}
