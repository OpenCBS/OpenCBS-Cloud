package com.opencbs.core.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class WriteOffCalculateDto {

    private BigDecimal principal;
    private BigDecimal interest;
    private BigDecimal penalty;
}
