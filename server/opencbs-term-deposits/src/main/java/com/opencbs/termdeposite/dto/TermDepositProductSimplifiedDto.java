package com.opencbs.termdeposite.dto;

import com.opencbs.core.domain.enums.Frequency;
import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.CurrencyDto;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class TermDepositProductSimplifiedDto extends BaseDto {

    private String name;
    private String code;
    private List<String> availability;
    private CurrencyDto currency;
    private BigDecimal amountMin;
    private BigDecimal amountMax;
    private BigDecimal interestRateMin;
    private BigDecimal interestRateMax;
    private BigDecimal termAgreementMin;
    private BigDecimal termAgreementMax;
    private Frequency interestAccrualFrequency;
    private BigDecimal earlyCloseFeeFlatMin;
    private BigDecimal earlyCloseFeeFlatMax;
    private BigDecimal earlyCloseFeeRateMin;
    private BigDecimal earlyCloseFeeRateMax;
    private StatusType statusType = StatusType.ACTIVE;
}
