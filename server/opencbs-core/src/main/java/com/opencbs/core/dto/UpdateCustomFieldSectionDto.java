package com.opencbs.core.dto;

import lombok.Data;

@Data
public class UpdateCustomFieldSectionDto extends BaseDto {

    private String caption;
    private int order;
}
