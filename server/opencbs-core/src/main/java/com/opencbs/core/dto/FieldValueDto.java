package com.opencbs.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FieldValueDto {
    ///TODO fieldId can be remove becouse we can use CODE
    private long fieldId;

    private String code;
    private String value;
}
