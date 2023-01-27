package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.dto.PersonDto;
import com.opencbs.core.validators.customfields.PersonCustomFieldValueDtoValidator;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class PersonDtoValidator {

    private final PersonCustomFieldValueDtoValidator personCustomFieldValueDtoValidator;

    @Autowired
    public PersonDtoValidator(PersonCustomFieldValueDtoValidator personCustomFieldValueDtoValidator) {
        this.personCustomFieldValueDtoValidator = personCustomFieldValueDtoValidator;
    }

    public void validate(PersonDto personDto) {
        this.personCustomFieldValueDtoValidator.validate(personDto.getFieldValues(), personDto.getId());
    }
}
