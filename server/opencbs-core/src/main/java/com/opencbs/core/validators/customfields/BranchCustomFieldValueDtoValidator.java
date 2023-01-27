package com.opencbs.core.validators.customfields;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.customfields.BranchCustomField;
import com.opencbs.core.domain.customfields.BranchCustomFieldValue;
import com.opencbs.core.repositories.customFields.BranchCustomFieldRepository;
import com.opencbs.core.repositories.customFields.BranchCustomFieldValueRepository;
import com.opencbs.core.services.customFields.BranchCustomFieldService;
import com.opencbs.core.validators.typevalidators.FieldTypeValidatorFactory;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class BranchCustomFieldValueDtoValidator extends CustomFieldValueDtoValidator<BranchCustomField, BranchCustomFieldValue,
        BranchCustomFieldRepository, BranchCustomFieldValueRepository, BranchCustomFieldService> {

    @Autowired
    BranchCustomFieldValueDtoValidator(BranchCustomFieldService customFieldService, FieldTypeValidatorFactory fieldTypeValidatorFactory) {
        super(customFieldService, fieldTypeValidatorFactory);
    }
}
