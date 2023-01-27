package com.opencbs.loans.dto.products;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LoanProductProvisionDto extends BaseDto {
    private Long lateDays;
    private BigDecimal ratePrincipal;
    private BigDecimal rateInterest;
    private BigDecimal ratePenalty;
}
