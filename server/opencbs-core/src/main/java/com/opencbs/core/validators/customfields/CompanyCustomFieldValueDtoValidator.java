package com.opencbs.core.validators.customfields;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.customfields.CompanyCustomField;
import com.opencbs.core.domain.customfields.CompanyCustomFieldValue;
import com.opencbs.core.repositories.customFields.CompanyCustomFieldRepository;
import com.opencbs.core.repositories.customFields.CompanyCustomFieldValueRepository;
import com.opencbs.core.services.customFields.CompanyCustomFieldService;
import com.opencbs.core.validators.typevalidators.FieldTypeValidatorFactory;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class CompanyCustomFieldValueDtoValidator
        extends CustomFieldValueDtoValidator<CompanyCustomField, CompanyCustomFieldValue, CompanyCustomFieldRepository,
        CompanyCustomFieldValueRepository, CompanyCustomFieldService> {

    @Autowired
    public CompanyCustomFieldValueDtoValidator(CompanyCustomFieldService customFieldService, FieldTypeValidatorFactory fieldTypeValidatorFactory) {
        super(customFieldService, fieldTypeValidatorFactory);
    }
}
