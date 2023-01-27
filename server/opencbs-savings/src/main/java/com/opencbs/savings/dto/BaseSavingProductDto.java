package com.opencbs.savings.dto;

import com.opencbs.core.domain.enums.Frequency;
import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BaseSavingProductDto extends BaseDto {

    private String name;
    private String code;
    private List<String> availability;

    private BigDecimal initialAmountMin;
    private BigDecimal initialAmountMax;
    private BigDecimal interestRateMin;
    private BigDecimal interestRateMax;
    private Frequency interestAccrualFrequency;
    private Frequency postingFrequency;
    private boolean capitalized;

    private BigDecimal depositAmountMin;
    private BigDecimal depositAmountMax;
    private BigDecimal depositFeeRateMin;
    private BigDecimal depositFeeRateMax;
    private BigDecimal depositFeeFlatMin;
    private BigDecimal depositFeeFlatMax;

    private BigDecimal withdrawalAmountMin;
    private BigDecimal withdrawalAmountMax;
    private BigDecimal withdrawalFeeRateMin;
    private BigDecimal withdrawalFeeRateMax;
    private BigDecimal withdrawalFeeFlatMin;
    private BigDecimal withdrawalFeeFlatMax;

    private BigDecimal managementFeeRateMin;
    private BigDecimal managementFeeRateMax;
    private BigDecimal managementFeeFlatMin;
    private BigDecimal managementFeeFlatMax;
    private Frequency managementFeeFrequency;

    private BigDecimal entryFeeRateMin;
    private BigDecimal entryFeeRateMax;
    private BigDecimal entryFeeFlatMin;
    private BigDecimal entryFeeFlatMax;

    private BigDecimal closeFeeRateMin;
    private BigDecimal closeFeeRateMax;
    private BigDecimal closeFeeFlatMin;
    private BigDecimal closeFeeFlatMax;

    private BigDecimal minBalance;

    private StatusType statusType = StatusType.ACTIVE;
}