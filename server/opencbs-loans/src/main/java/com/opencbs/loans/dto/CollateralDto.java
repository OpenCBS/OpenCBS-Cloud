package com.opencbs.loans.dto;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.UserDetailsDto;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CollateralDto extends BaseDto {

    private String name;

    private BigDecimal amount;

    private CustomFieldSectionDto typeOfCollateral;

    private LocalDateTime createdAt;

    private UserDetailsDto createdBy;

    private LocalDateTime closedAt;

    private UserDetailsDto closedBy;

    private boolean isDeleted;
}
