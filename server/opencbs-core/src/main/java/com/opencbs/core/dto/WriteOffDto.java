package com.opencbs.core.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class WriteOffDto {
    private LocalDateTime date;
    private String comment;
    private BigDecimal principal;
    private BigDecimal interest;
    private BigDecimal penalty;
}
