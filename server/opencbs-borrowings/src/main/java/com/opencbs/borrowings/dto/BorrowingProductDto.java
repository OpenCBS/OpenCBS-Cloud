package com.opencbs.borrowings.dto;

import com.opencbs.core.dto.BaseProductDto;
import lombok.Data;

@Data
public class BorrowingProductDto extends BaseProductDto {

    private Long currencyId;
    private BorrowingProductAccountDto accountList;
}
