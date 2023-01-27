package com.opencbs.savings.dto;

import lombok.Data;

@Data
public class SavingProductDto extends BaseSavingProductDto {

    private Long currencyId;
    private SavingAccountDto accounts;

}