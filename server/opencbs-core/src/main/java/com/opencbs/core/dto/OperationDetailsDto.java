package com.opencbs.core.dto;

import com.opencbs.core.dto.profiles.ProfileDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OperationDetailsDto extends BaseDto {

    private LocalDateTime createdAt;
    private ProfileDto profile;
    private String vaultName;
    private BigDecimal amount;
    private String operationType;
    private CurrencyDto currency;
    private UserInfoDto createdBy;
    private String description;
    private String accountNumber;
    private String accountName;
}
