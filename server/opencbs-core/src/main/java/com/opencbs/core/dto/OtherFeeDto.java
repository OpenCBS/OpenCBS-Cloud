package com.opencbs.core.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OtherFeeDto extends BaseDto {

    private String name;

    private String description;

    private LocalDateTime createdAt;

    private UserInfoDto createdBy;

    private BigDecimal balance;

    private boolean charged;
}
