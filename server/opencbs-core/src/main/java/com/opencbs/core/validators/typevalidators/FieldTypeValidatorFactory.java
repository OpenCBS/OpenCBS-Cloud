package com.opencbs.core.validators.typevalidators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.enums.CustomFieldType;

import java.util.Optional;

@Validator
public class FieldTypeValidatorFactory {

    public Optional<FieldTypeValidator> getValidator(CustomFieldType customFieldType) {
        switch (customFieldType) {
            case DATE:
                return Optional.of(new DateFieldTypeValidator());

            case NUMERIC:
                return Optional.of(new NumericFieldTypeValidator());

            case LIST:
                return Optional.of(new ListFieldTypeValidator());

            case PATTERN:
                return Optional.of(new PatternFieldTypeValidator());

            default:
                return Optional.empty();
        }
    }
}
