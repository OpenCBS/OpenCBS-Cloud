package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.dto.group.GroupDto;
import com.opencbs.core.validators.customfields.GroupCustomFieldValueDtoValidator;
import org.springframework.beans.factory.annotation.Autowired;

@Validator
public class GroupDtoValidator {

    private final GroupCustomFieldValueDtoValidator groupCustomFieldValueDtoValidator;

    @Autowired
    public GroupDtoValidator(GroupCustomFieldValueDtoValidator groupCustomFieldValueDtoValidator) {
        this.groupCustomFieldValueDtoValidator = groupCustomFieldValueDtoValidator;
    }

    public void validate(GroupDto groupDto) {
        this.groupCustomFieldValueDtoValidator.validate(groupDto.getFieldValues(), groupDto.getId());
    }
}
