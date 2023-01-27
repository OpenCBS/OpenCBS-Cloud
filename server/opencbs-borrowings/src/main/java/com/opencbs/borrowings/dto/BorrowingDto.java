package com.opencbs.borrowings.dto;

import lombok.Data;

@Data
public class BorrowingDto extends BorrowingBaseDto {
    private Long borrowingProductId;
    private Long profileId;
    private Long correspondenceAccountId;
}
