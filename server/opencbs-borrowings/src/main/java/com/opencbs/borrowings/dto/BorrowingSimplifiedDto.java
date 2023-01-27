package com.opencbs.borrowings.dto;

import lombok.Data;

@Data
public class BorrowingSimplifiedDto extends BorrowingBaseDto {
    private String profileName;
    private String createdBy;
    private String code;
    private String loanProductName;
}
