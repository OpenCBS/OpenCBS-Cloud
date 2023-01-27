package com.opencbs.loans.dto;

import com.opencbs.core.dto.OtherFeeDetailDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LoanOtherFeeDto extends OtherFeeDetailDto {

    private BigDecimal balance;

    private boolean charged;
}
