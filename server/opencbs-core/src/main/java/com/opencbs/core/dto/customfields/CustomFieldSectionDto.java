package com.opencbs.core.dto.customfields;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.util.List;

@Data
public class CustomFieldSectionDto extends BaseDto {

    private String caption;
    private int order;
    private List<CustomFieldDto> customFields;

}
