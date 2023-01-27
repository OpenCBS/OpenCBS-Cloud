package com.opencbs.core.accounting.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@RequiredArgsConstructor
@Getter
public class MultipleTransactionAmountDto {
    @DecimalMin(value = "0.0")
    private final BigDecimal amount;
    @NotNull
    private final Long accountId;
}
