package com.opencbs.loans.dto;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.FieldValueDto;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
public class CollateralUpdateDto extends BaseDto {

    private String name;

    private BigDecimal amount;

    private Integer typeOfCollateralId;

    private List<FieldValueDto> fieldValues;

    public CollateralUpdateDto(){
        fieldValues = new ArrayList<>();
    }
}
