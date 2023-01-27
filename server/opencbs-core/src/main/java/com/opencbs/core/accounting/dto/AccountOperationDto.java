package com.opencbs.core.accounting.dto;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AccountOperationDto extends BaseDto {
    private LocalDateTime date;
    private BigDecimal deposit;
    private BigDecimal withdraw;
    private BigDecimal balance;
    private String description;
    private AccountDto source;
    private String documentNumber;
}
