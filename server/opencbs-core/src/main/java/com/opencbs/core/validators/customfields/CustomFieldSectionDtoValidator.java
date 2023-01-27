package com.opencbs.core.validators.customfields;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.dto.UpdateCustomFieldSectionDto;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

@Validator
public class CustomFieldSectionDtoValidator {

    public void validate(UpdateCustomFieldSectionDto updateDto) {
        Assert.isTrue(!StringUtils.isEmpty(updateDto.getCaption()), "Caption is required.");
    }
}
