package com.opencbs.loans.dto;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class GuarantorDto extends BaseDto {

    private Long profileId;

    private Integer relationshipId;

    private BigDecimal amount;

    private String description;
}
