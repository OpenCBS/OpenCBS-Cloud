package com.opencbs.core.domain.transfers;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransferBetweenMemberships {
    private Long sourceAccountId;
    private Long destinationAccountId;
    private BigDecimal amount;
    private String description;
    private LocalDate date;
}
