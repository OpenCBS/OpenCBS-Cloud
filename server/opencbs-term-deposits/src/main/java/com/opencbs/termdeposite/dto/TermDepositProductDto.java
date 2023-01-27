package com.opencbs.termdeposite.dto;

import com.opencbs.core.domain.enums.Frequency;
import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class TermDepositProductDto extends BaseDto {

    private String name;
    private String code;
    private List<String> availability;

    private Long currencyId;
    private BigDecimal amountMin;
    private BigDecimal amountMax;

    private BigDecimal termAgreementMin;
    private BigDecimal termAgreementMax;

    private BigDecimal interestRateMin;
    private BigDecimal interestRateMax;

    private Frequency interestAccrualFrequency;

    private BigDecimal earlyCloseFeeFlatMin;
    private BigDecimal earlyCloseFeeFlatMax;
    private BigDecimal earlyCloseFeeRateMin;
    private BigDecimal earlyCloseFeeRateMax;

    private TermDepositProductAccountDto accountList;

    private StatusType statusType = StatusType.ACTIVE;
}
