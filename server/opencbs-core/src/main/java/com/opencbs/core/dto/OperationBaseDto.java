package com.opencbs.core.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OperationBaseDto extends BaseDto {

    private BigDecimal amount;
    private String description;
    private Long initiatorId;
    private String initiator;
    private Boolean isProfileExist;
    private LocalDateTime date;
}
