package com.opencbs.core.validators.customfields;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.customfields.PersonCustomField;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.repositories.customFields.PersonCustomFieldRepository;
import com.opencbs.core.repositories.customFields.PersonCustomFieldValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

@Validator
public class PersonCustomFieldDtoValidator extends CustomFieldDtoValidator implements CustomFieldValidator {

    private final PersonCustomFieldValueRepository personCustomFieldValueRepository;

    @Autowired
    public PersonCustomFieldDtoValidator(PersonCustomFieldRepository personCustomFieldRepository,
                                         PersonCustomFieldValueRepository personCustomFieldValueRepository) {
        super(personCustomFieldRepository);
        this.personCustomFieldValueRepository = personCustomFieldValueRepository;
    }

    public void validateOnEdit(PersonCustomField personCustomField, CustomFieldDto customFieldDto) {
        if (this.personCustomFieldValueRepository.existsByCustomFieldAndStatus(personCustomField, EntityStatus.LIVE)) {
            Assert.isTrue(personCustomField.getFieldType().equals(customFieldDto.getFieldType()), "You cannot change custom field type");
            Assert.isTrue(personCustomField.isUnique() == customFieldDto.isUnique(), "You cannot edit custom field uniqueness");
        }
    }
}
