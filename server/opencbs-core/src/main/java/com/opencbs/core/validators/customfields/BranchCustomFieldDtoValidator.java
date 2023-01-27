package com.opencbs.core.validators.customfields;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.customfields.BranchCustomField;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.repositories.customFields.BranchCustomFieldRepository;
import com.opencbs.core.repositories.customFields.BranchCustomFieldValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

@Validator
public class BranchCustomFieldDtoValidator extends CustomFieldDtoValidator implements CustomFieldValidator {

    private final BranchCustomFieldValueRepository branchCustomFieldValueRepository;

    @Autowired
    public BranchCustomFieldDtoValidator(BranchCustomFieldRepository branchCustomFieldRepository,
                                         BranchCustomFieldValueRepository branchCustomFieldValueRepository) {
        super(branchCustomFieldRepository);
        this.branchCustomFieldValueRepository = branchCustomFieldValueRepository;
    }

    public void validateOnEdit(BranchCustomField branchCustomField, CustomFieldDto customFieldDto) {
        if (this.branchCustomFieldValueRepository.existsByCustomFieldAndStatus(branchCustomField, EntityStatus.LIVE)) {
            Assert.isTrue(branchCustomField.getFieldType().equals(customFieldDto.getFieldType()), "You cannot change custom field type");
            Assert.isTrue(branchCustomField.isUnique() == customFieldDto.isUnique(), "You cannot edit custom field uniqueness");
        }
    }
}
