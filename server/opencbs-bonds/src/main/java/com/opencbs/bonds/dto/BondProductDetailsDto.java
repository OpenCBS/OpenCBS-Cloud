package com.opencbs.bonds.dto;

import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.enums.Frequency;
import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BondProductDetailsDto extends BaseDto {

    private String name;

    private String code;

    private BigDecimal amount;

    private BigDecimal numberMin;

    private BigDecimal numberMax;

    private Currency currency;

    private BigDecimal interestRateMin;

    private BigDecimal interestRateMax;

    private BigDecimal penaltyRateMin;

    private BigDecimal penaltyRateMax;

    private Frequency frequency;

    private int maturityMin;

    private int maturityMax;

    private String interestScheme;
}
