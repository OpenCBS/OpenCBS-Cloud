package com.opencbs.core.validators.customfields;

import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.CustomFieldValue;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.FieldValueDto;
import com.opencbs.core.repositories.CustomFieldRepository;
import com.opencbs.core.repositories.CustomFieldValueRepository;
import com.opencbs.core.services.customFields.CustomFieldService;
import com.opencbs.core.validators.typevalidators.FieldTypeValidator;
import com.opencbs.core.validators.typevalidators.FieldTypeValidatorFactory;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

public class CustomFieldValueDtoValidator<Tcf extends CustomField, Tcvf extends CustomFieldValue<Tcf>,
        Trepo extends CustomFieldRepository<Tcf>,
        TCustomValueRepo extends CustomFieldValueRepository<Tcvf>,
        Tcfs extends CustomFieldService<Tcf, Tcvf, Trepo, TCustomValueRepo>> {

    private final Tcfs customFieldService;
    private final FieldTypeValidatorFactory fieldTypeValidatorFactory;

    CustomFieldValueDtoValidator(Tcfs customFieldService, FieldTypeValidatorFactory fieldTypeValidatorFactory) {
        this.customFieldService = customFieldService;
        this.fieldTypeValidatorFactory = fieldTypeValidatorFactory;
    }

    public void validate(List<FieldValueDto> customFieldValues, Long ownerId) {
        for (Tcf customField : this.customFieldService.findAll()) {
            // Find the corresponding value in the list.
            Optional<FieldValueDto> value = customFieldValues
                    .stream()
                    .filter(x-> {
                                if (x.getFieldId()==0) {
                                    return x.getCode().equals(customField.getName());
                                }
                                return x.getFieldId() == customField.getId();
                            }
                    )
                    .findFirst();
            // Make sure the value is found. Otherwise, throw an IllegalArgumentException.
            Assert.isTrue(value.isPresent(), String.format("Value for custom field {id: %d} not found.", customField.getId()));
            //noinspection OptionalGetWithoutIsPresent
            this.validate(value.get(), customField, ownerId);
        }
    }

    private void validate(FieldValueDto value, Tcf customField, Long ownerId) {
        boolean isRequired = customField.isRequired();
        boolean isEmpty = StringUtils.isEmpty(value.getValue());
        boolean isRequiredAndEmpty = isRequired && isEmpty;
        Assert.isTrue(!isRequiredAndEmpty, String.format("Value for custom field {id: %d} is required.", customField.getId()));

        if (isEmpty) return;

        if(customField.isUnique()) {
            Optional<Tcvf> uniqueCustomField =
                    customFieldService.findOneByFieldIdAndStatusAndValue(customField.getId(), EntityStatus.LIVE, value.getValue());
            if (uniqueCustomField.isPresent() && !isCustomFieldItSelf(uniqueCustomField.get().getOwnerId(), ownerId)) {
                throw new IllegalArgumentException("Custom field with Name: " + customField.getCaption() + " should be unique.");
            }
        }
        this.validateByType(value.getValue(), customField);
    }

    private void validateByType(String value, Tcf customField) {
        Optional<FieldTypeValidator> validator = this.fieldTypeValidatorFactory.getValidator(customField.getFieldType());
        validator.ifPresent(fieldTypeValidator -> fieldTypeValidator.validate(customField, value));
    }

    private boolean isCustomFieldItSelf(Long existingValue, Long newValue) {
        return existingValue.equals(newValue);
    }

}
