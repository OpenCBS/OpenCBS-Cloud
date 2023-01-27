package com.opencbs.core.validators.customfields;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.customfields.GroupCustomField;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.repositories.customFields.GroupCustomFieldRepository;
import com.opencbs.core.repositories.customFields.GroupCustomFieldValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;


@Validator
public class GroupCustomFieldDtoValidator extends CustomFieldDtoValidator implements CustomFieldValidator {

    private final GroupCustomFieldValueRepository groupCustomFieldValueRepository;

    @Autowired
    public GroupCustomFieldDtoValidator(GroupCustomFieldRepository groupCustomFieldRepository,
                                        GroupCustomFieldValueRepository groupCustomFieldValueRepository) {
        super(groupCustomFieldRepository);
        this.groupCustomFieldValueRepository = groupCustomFieldValueRepository;
    }

    public void validateOnEdit(GroupCustomField groupCustomField, CustomFieldDto customFieldDto) {
        if (this.groupCustomFieldValueRepository.existsByCustomFieldAndStatus(groupCustomField, EntityStatus.LIVE)) {
            Assert.isTrue(groupCustomField.getFieldType().equals(customFieldDto.getFieldType()), "You cannot change custom field type");
            Assert.isTrue(groupCustomField.isUnique() == customFieldDto.isUnique(), "You cannot edit custom field uniqueness");
        }
    }
}
