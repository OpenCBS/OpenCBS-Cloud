package com.opencbs.borrowings.dto;

import com.opencbs.core.dto.BaseProductDto;
import com.opencbs.core.dto.CurrencyDto;
import lombok.Data;

import java.util.List;

@Data
public class BorrowingProductDetailsDto extends BaseProductDto {
    private CurrencyDto currency;
    private List<BorrowingProductAccountDetailsDto> accounts;
}
