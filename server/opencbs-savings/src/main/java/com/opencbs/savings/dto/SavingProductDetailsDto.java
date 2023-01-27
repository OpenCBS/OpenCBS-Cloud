package com.opencbs.savings.dto;

import com.opencbs.core.dto.CurrencyDto;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import lombok.Data;

@Data
public class SavingProductDetailsDto extends BaseSavingProductDto implements BaseRequestDto {

    private CurrencyDto currency;
    private SavingAccountDetailsDto accounts;
    private boolean isReadOnly;

}