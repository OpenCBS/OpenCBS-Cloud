package com.opencbs.core.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentSplitDto {
    private BigDecimal penalty;
    private BigDecimal interest;
    private BigDecimal principal;
}
