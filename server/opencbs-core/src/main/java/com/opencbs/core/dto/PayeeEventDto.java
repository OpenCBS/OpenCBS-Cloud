package com.opencbs.core.dto;

import com.opencbs.core.domain.enums.EventType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PayeeEventDto extends BaseDto {

    private EventType eventType;

    private LocalDateTime createdAt;

    private UserInfoDto createdBy;

    private Long loanApplicationPayeeId;

    private LocalDateTime effectiveAt;

    private Boolean deleted;

    private BigDecimal amount;

    private Long groupKey;

    private String checkNumber;

    private String description;

    private boolean system;
}
