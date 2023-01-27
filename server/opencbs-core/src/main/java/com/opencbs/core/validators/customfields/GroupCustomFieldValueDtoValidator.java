package com.opencbs.core.validators.customfields;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.customfields.GroupCustomField;
import com.opencbs.core.domain.customfields.GroupCustomFieldValue;
import com.opencbs.core.repositories.customFields.GroupCustomFieldRepository;
import com.opencbs.core.repositories.customFields.GroupCustomFieldValueRepository;
import com.opencbs.core.services.customFields.GroupCustomFieldService;
import com.opencbs.core.validators.typevalidators.FieldTypeValidatorFactory;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class GroupCustomFieldValueDtoValidator extends CustomFieldValueDtoValidator<
        GroupCustomField,
        GroupCustomFieldValue,
        GroupCustomFieldRepository,
        GroupCustomFieldValueRepository,
        GroupCustomFieldService> {

    @Autowired
    public GroupCustomFieldValueDtoValidator(GroupCustomFieldService customFieldService,
                                             FieldTypeValidatorFactory fieldTypeValidatorFactory) {
        super(customFieldService, fieldTypeValidatorFactory);
    }
}
