package com.opencbs.termdeposite.dto;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class GetTermDepositDetailsDto extends BaseDto {

    private BigDecimal amount;
    private String code;
    private String termDepositProductName;
    private String serviceOfficerFirstName;
    private String serviceOfficerLastName;
    private String status;
    private LocalDateTime openDate;
    private LocalDateTime closeDate;
    private LocalDateTime createdAt;
    private String profileName;
    private String profileType;
    private Long profileId;
    private BigDecimal interestRate;
    private BigDecimal termAgreement;
    private BigDecimal earlyCloseFeeRate;
    private BigDecimal earlyCloseFeeFlat;
    private long serviceOfficerId;
    private long termDepositProductId;
    private BigDecimal termDepositProductAmountMin;
    private BigDecimal termDepositProductAmountMax;
    private Boolean locked;
    private BigDecimal termDepositBalance;
    private BigDecimal accruedInterest;

}
