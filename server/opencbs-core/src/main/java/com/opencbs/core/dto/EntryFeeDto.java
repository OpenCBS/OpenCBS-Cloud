package com.opencbs.core.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class EntryFeeDto extends EntryFeeBaseDto {

    private BigDecimal amount;
    private Boolean validate = true;
    private Boolean percentage;


    @Builder
    public EntryFeeDto(long id, String name, BigDecimal minValue, BigDecimal maxValue, BigDecimal minLimit, BigDecimal maxLimit, BigDecimal amount, Boolean validate, Boolean percentage) {
        super(id, name, minValue, maxValue, minLimit, maxLimit);
        this.amount = amount;
        this.validate = validate;
        this.percentage = percentage;
    }
}