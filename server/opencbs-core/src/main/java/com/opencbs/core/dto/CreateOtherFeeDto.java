package com.opencbs.core.dto;

import lombok.Data;

@Data
public class CreateOtherFeeDto extends OtherFeeDto {

    private Long chargeAccountId;

    private Long incomeAccountId;

    private Long expenseAccountId;
}
