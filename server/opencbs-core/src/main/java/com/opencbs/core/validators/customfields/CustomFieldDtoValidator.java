package com.opencbs.core.validators.customfields;

import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.CustomFieldExtra;
import com.opencbs.core.domain.enums.CustomFieldType;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.mappers.CustomFieldMapper;
import com.opencbs.core.repositories.CustomFieldRepository;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.Optional;

public abstract class CustomFieldDtoValidator {

    private final CustomFieldRepository customFieldRepository;

    public CustomFieldDtoValidator(CustomFieldRepository customFieldRepository) {
        this.customFieldRepository = customFieldRepository;
    }

    public void validate(CustomFieldDto customFieldDto) {
        Assert.isTrue(!StringUtils.isEmpty(customFieldDto.getName()), "Name is required.");
        Assert.isTrue(!StringUtils.isEmpty(customFieldDto.getCaption()), "Caption is required.");
        Assert.isTrue(customFieldDto.getSectionId() > 0, "SectionId is required.");

        if (customFieldDto.getFieldType() == CustomFieldType.LOOKUP) {
            CustomFieldExtra extra = customFieldDto.getExtra();
            Assert.notNull(extra, "Invalid lookup type.");
        }

        this.checkToUniqueName(customFieldDto);
    }

    private void checkToUniqueName(CustomFieldDto customFieldDto) {
        String convertedName = CustomFieldMapper.convertCustomFieldName(customFieldDto.getName());
        Optional<CustomField> optionalCustomField = this.customFieldRepository.findOneBySectionIdAndName(customFieldDto.getSectionId(), convertedName);
        if (optionalCustomField.isPresent()) {
            Assert.isTrue(optionalCustomField.get().getId().equals(customFieldDto.getId()),
                    "Name into section should be unique");
        }
    }
}
