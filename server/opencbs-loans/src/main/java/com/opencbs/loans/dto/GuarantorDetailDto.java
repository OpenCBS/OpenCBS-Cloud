package com.opencbs.loans.dto;

import com.opencbs.core.domain.Relationship;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.UserDetailsDto;
import com.opencbs.core.dto.profiles.ProfileDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class GuarantorDetailDto extends BaseDto {

    private ProfileDto profile;

    private BigDecimal amount;

    private String description;

    private Relationship relationship;

    private LocalDateTime createdAt;

    private UserDetailsDto createdBy;

    private LocalDateTime closedAt;

    private UserDetailsDto closedBy;

    private boolean isDeleted;
}
