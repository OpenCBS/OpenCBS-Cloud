package com.opencbs.loans.dto;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.dto.customfields.CustomFieldValueDto;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CollateralDetailDto extends BaseDto {

    private String name;

    private BigDecimal amount;

    private CustomFieldSectionDto typeOfCollateral;

    private List<CustomFieldValueDto> customFieldValues;
}
