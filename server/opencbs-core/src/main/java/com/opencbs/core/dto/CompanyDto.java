package com.opencbs.core.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
@Data
public class CompanyDto extends BaseDto {

    private List<FieldValueDto> fieldValues;
    private BranchDto branch;

    public CompanyDto(){
        fieldValues = new ArrayList<>();
    }

}
