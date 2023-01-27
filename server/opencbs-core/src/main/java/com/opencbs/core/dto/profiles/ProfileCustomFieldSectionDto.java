package com.opencbs.core.dto.profiles;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.customfields.CustomFieldValueDto;
import lombok.Data;

import java.util.List;

@Data
public class ProfileCustomFieldSectionDto extends BaseDto {

    private String caption;
    private int order;
    private List<CustomFieldValueDto> values;
}
