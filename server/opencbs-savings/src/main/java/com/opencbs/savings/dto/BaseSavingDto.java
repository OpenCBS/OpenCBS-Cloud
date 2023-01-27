package com.opencbs.savings.dto;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public abstract class BaseSavingDto extends BaseDto {

    private BigDecimal interestRate;
    private LocalDateTime openDate;
    private BigDecimal depositFeeRate;
    private BigDecimal depositFeeFlat;
    private BigDecimal withdrawalFeeRate;
    private BigDecimal withdrawalFeeFlat;
    private BigDecimal entryFeeRate;
    private BigDecimal entryFeeFlat;
    private BigDecimal closeFeeRate;
    private BigDecimal closeFeeFlat;
    private BigDecimal managementFeeRate;
    private BigDecimal managementFeeFlat;
    private boolean locked;

}
