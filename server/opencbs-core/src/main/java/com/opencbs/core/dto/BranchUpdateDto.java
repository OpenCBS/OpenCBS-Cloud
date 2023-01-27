package com.opencbs.core.dto;

import lombok.Data;

@Data
public class BranchUpdateDto extends FieldDto {

    private String name;
    private String code;
}
