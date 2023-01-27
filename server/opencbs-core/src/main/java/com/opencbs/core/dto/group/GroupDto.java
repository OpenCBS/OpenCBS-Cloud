package com.opencbs.core.dto.group;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.FieldValueDto;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class GroupDto extends BaseDto {

    private List<FieldValueDto> fieldValues;

    public GroupDto(){
        fieldValues = new ArrayList<>();
    }

}
