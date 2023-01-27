package com.opencbs.loans.dto.loanapplications;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LoanApplicationEntryFeeDto extends BaseDto {

    private BigDecimal amount;

    private BigDecimal rate;

    private Integer entryFeeId;
}
