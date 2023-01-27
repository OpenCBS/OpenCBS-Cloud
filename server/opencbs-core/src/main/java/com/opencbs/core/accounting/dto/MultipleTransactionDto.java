package com.opencbs.core.accounting.dto;

import lombok.Data;
import org.hibernate.validator.constraints.NotEmpty;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class MultipleTransactionDto {
    @NotEmpty
    private List<MultipleTransactionAmountDto> amounts;
    private Long accountId;
    private Boolean accountWillBeDebit;
    private String description;
    private LocalDateTime dateTime;
}
