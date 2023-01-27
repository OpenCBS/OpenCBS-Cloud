package com.opencbs.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LookTypeDto extends BaseDto {

    private String key;
    private String name;
}
