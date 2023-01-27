package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.mappers.CustomFieldMapper;
import com.opencbs.loans.domain.customfields.TypeOfCollateralCustomField;
import com.opencbs.loans.repositories.TypeOfCollateralCustomFieldValueRepository;
import com.opencbs.loans.services.TypeOfCollateralCustomFieldService;
import lombok.NonNull;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Validator
public class TypeOfCollateralCustomFieldDtoValidator {

    private final TypeOfCollateralCustomFieldService typeOfCollateralCustomFieldService;
    private final TypeOfCollateralCustomFieldValueRepository collateralCustomFieldValueRepository;

    public TypeOfCollateralCustomFieldDtoValidator(TypeOfCollateralCustomFieldService typeOfCollateralCustomFieldService,
                                                   TypeOfCollateralCustomFieldValueRepository collateralCustomFieldValueRepository) {
        this.typeOfCollateralCustomFieldService = typeOfCollateralCustomFieldService;
        this.collateralCustomFieldValueRepository = collateralCustomFieldValueRepository;
    }

    public void validate(@NonNull CustomFieldDto customFieldDto) {
        Assert.isTrue(!StringUtils.isEmpty(customFieldDto.getName()), "Name is required.");
        Assert.isTrue(!StringUtils.isEmpty(customFieldDto.getName().trim()), "Name is required.");
        Assert.isTrue(!StringUtils.isEmpty(customFieldDto.getCaption()), "Caption is required.");
        Assert.isTrue(!StringUtils.isEmpty(customFieldDto.getCaption().trim()), "Caption is required.");
    }

    public void validateOnCreate(@NonNull CustomFieldDto customFieldDto) {
        validate(customFieldDto);

        Optional<TypeOfCollateralCustomField> existingCustomField = typeOfCollateralCustomFieldService.findBySectionIdAndName(
                customFieldDto.getSectionId(),
                CustomFieldMapper.convertCustomFieldName(customFieldDto.getName())
        );

        Assert.isTrue(!existingCustomField.isPresent(), "Name is already taken.");
    }

    public void validateOnEdit(TypeOfCollateralCustomField collateralCustomField, CustomFieldDto customFieldDto) {
        if (this.collateralCustomFieldValueRepository.existsByCustomFieldAndStatus(collateralCustomField, EntityStatus.LIVE)) {
            Assert.isTrue(collateralCustomField.getFieldType().equals(customFieldDto.getFieldType()), "You cannot change custom field type");
            Assert.isTrue(collateralCustomField.isUnique() == customFieldDto.isUnique(), "You cannot edit custom field uniqueness");
        }
    }
}
