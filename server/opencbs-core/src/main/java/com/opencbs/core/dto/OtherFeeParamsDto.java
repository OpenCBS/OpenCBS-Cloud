package com.opencbs.core.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OtherFeeParamsDto {
    private BigDecimal amount;
    private LocalDateTime date;
    private String comment;
}
