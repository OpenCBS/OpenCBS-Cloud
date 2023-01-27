package com.opencbs.termdeposite.dto;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.UserDetailsDto;
import com.opencbs.core.dto.profiles.ProfileDto;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TermDepositDetailsDto extends BaseDto implements BaseRequestDto {

    private BigDecimal amount;
    private String code;
    private ProfileDto profile;
    private TermDepositProductDetailsDto termDepositProduct;
    private UserDetailsDto serviceOfficer;
    private String status;
    private TermDepositAccountDetailsDto accounts;
    private BigDecimal interestRate;
    private LocalDateTime openDate;
    private LocalDateTime createdDate;
    private BigDecimal termAgreement;
    private BigDecimal earlyCloseFeeRate;
    private BigDecimal earlyCloseFeeFlat;
    private Boolean locked;

}
