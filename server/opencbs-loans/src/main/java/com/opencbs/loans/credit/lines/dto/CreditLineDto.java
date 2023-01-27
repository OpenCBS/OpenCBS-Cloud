package com.opencbs.loans.credit.lines.dto;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreditLineDto extends BaseDto {

    private String name;
    private BigDecimal committedAmount;
    private BigDecimal availableAmount;
}
