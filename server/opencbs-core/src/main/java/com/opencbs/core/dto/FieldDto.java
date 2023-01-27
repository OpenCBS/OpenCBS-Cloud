package com.opencbs.core.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class FieldDto extends BaseDto {

    private List<FieldValueDto> fieldValues;

    public FieldDto(){
        fieldValues = new ArrayList<>();
    }
}
