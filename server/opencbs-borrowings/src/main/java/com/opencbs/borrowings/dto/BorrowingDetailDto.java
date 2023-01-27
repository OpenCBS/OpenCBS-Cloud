package com.opencbs.borrowings.dto;

import com.opencbs.core.dto.profiles.ProfileDto;
import com.opencbs.core.dto.UserDto;
import com.opencbs.core.accounting.dto.AccountDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BorrowingDetailDto extends BorrowingBaseDto {
    private String code;
    private BigDecimal amount;
    private BorrowingProductDto borrowingProduct;
    private ProfileDto profile;
    private UserDto createdBy;
    private String status;
    private UserDto loanOfficer;
    private AccountDto correspondenceAccount;
}
