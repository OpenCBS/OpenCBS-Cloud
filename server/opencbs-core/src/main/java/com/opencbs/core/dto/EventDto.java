package com.opencbs.core.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EventDto extends BaseDto {

    private LocalDateTime createdAt;

    private UserInfoDto createdBy;

    private String eventType;

    private LocalDateTime effectiveAt;

    private Integer installmentNumber;

    private BigDecimal amount;

    private Boolean deleted;

    private Long groupKey;

    private String comment;

}
