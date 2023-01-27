package com.opencbs.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class EntryFeeBaseDto extends BaseDto {

    private String name;
    private BigDecimal minValue;
    private BigDecimal maxValue;
    private BigDecimal minLimit;
    private BigDecimal maxLimit;


    public EntryFeeBaseDto(long id, String name, BigDecimal minValue, BigDecimal maxValue, BigDecimal minLimit, BigDecimal maxLimit) {
        super(id);
        this.name = name;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.minLimit = minLimit;
        this.maxLimit = maxLimit;
    }
}
