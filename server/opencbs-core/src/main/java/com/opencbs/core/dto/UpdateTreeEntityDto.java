package com.opencbs.core.dto;

import lombok.Data;

@Data
public class UpdateTreeEntityDto extends BaseDto {

    private String name;
    private Long parentId;
}
