package com.opencbs.core.domain.schedule;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BatchRepay {

    private String name;

    private BigDecimal olb;

    private BigDecimal accruedInterest;

    private BigDecimal paidPrincipal;

    private BigDecimal paidInterest;

    private BigDecimal paidPenalty;

    private BigDecimal accruedPenalty;

    private BigDecimal principal;

    private BigDecimal interest;

    private BigDecimal penalty;

    private BigDecimal total;
}
