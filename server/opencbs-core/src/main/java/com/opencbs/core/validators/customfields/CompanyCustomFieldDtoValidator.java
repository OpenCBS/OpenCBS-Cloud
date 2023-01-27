package com.opencbs.core.validators.customfields;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.customfields.CompanyCustomField;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.repositories.customFields.CompanyCustomFieldRepository;
import com.opencbs.core.repositories.customFields.CompanyCustomFieldValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

@Validator
public class CompanyCustomFieldDtoValidator extends CustomFieldDtoValidator implements CustomFieldValidator {

    private final CompanyCustomFieldValueRepository companyCustomFieldValueRepository;

    @Autowired
    public CompanyCustomFieldDtoValidator(CompanyCustomFieldRepository companyCustomFieldRepository,
                                          CompanyCustomFieldValueRepository companyCustomFieldValueRepository) {
        super(companyCustomFieldRepository);
        this.companyCustomFieldValueRepository = companyCustomFieldValueRepository;
    }

    public void validateOnEdit(CompanyCustomField companyCustomField, CustomFieldDto customFieldDto) {
        if (this.companyCustomFieldValueRepository.existsByCustomFieldAndStatus(companyCustomField, EntityStatus.LIVE)) {
            Assert.isTrue(companyCustomField.getFieldType().equals(customFieldDto.getFieldType()), "You cannot change custom field type");
            Assert.isTrue(companyCustomField.isUnique() == customFieldDto.isUnique(), "You cannot edit custom field uniqueness");
        }
    }
}
