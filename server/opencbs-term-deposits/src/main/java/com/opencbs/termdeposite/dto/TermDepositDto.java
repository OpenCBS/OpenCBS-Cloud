package com.opencbs.termdeposite.dto;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TermDepositDto extends BaseDto {

    private Long profileId;
    private BigDecimal interestRate;
    private BigDecimal termAgreement;
    private BigDecimal earlyCloseFeeRate;
    private BigDecimal earlyCloseFeeFlat;
    private Long termDepositProductId;
    private Long serviceOfficerId;
    private LocalDateTime openDate;
    private boolean locked;
    private LocalDateTime createdDate;

}
