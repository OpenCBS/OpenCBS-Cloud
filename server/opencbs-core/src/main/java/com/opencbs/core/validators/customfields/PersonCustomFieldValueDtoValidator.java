package com.opencbs.core.validators.customfields;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.customfields.PersonCustomField;
import com.opencbs.core.domain.customfields.PersonCustomFieldValue;
import com.opencbs.core.repositories.customFields.PersonCustomFieldRepository;
import com.opencbs.core.repositories.customFields.PersonCustomFieldValueRepository;
import com.opencbs.core.services.customFields.PersonCustomFieldService;
import com.opencbs.core.validators.typevalidators.FieldTypeValidatorFactory;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class PersonCustomFieldValueDtoValidator extends CustomFieldValueDtoValidator<PersonCustomField, PersonCustomFieldValue,
        PersonCustomFieldRepository, PersonCustomFieldValueRepository, PersonCustomFieldService> {

    @Autowired
    public PersonCustomFieldValueDtoValidator(PersonCustomFieldService customFieldService, FieldTypeValidatorFactory fieldTypeValidatorFactory) {
        super(customFieldService, fieldTypeValidatorFactory);
    }
}
