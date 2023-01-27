package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.dto.CompanyDto;
import com.opencbs.core.validators.customfields.CompanyCustomFieldValueDtoValidator;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class CompanyDtoValidator {

    private final CompanyCustomFieldValueDtoValidator companyCustomFieldValueDtoValidator;

    @Autowired
    public CompanyDtoValidator(CompanyCustomFieldValueDtoValidator companyCustomFieldValueDtoValidator) {
        this.companyCustomFieldValueDtoValidator = companyCustomFieldValueDtoValidator;
    }

    public void validate(CompanyDto companyDto) {
        this.companyCustomFieldValueDtoValidator.validate(companyDto.getFieldValues(), companyDto.getId());
    }

}
