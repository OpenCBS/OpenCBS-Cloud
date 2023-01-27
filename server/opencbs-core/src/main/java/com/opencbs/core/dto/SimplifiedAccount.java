package com.opencbs.core.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SimplifiedAccount extends BaseDto {

    private String name;

    private String currency;

    private BigDecimal balance;
}
