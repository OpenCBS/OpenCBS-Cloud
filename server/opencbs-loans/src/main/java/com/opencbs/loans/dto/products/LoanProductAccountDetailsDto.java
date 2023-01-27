package com.opencbs.loans.dto.products;

import com.opencbs.core.accounting.dto.AccountDto;
import lombok.Data;

@Data
public class LoanProductAccountDetailsDto extends LoanProductAccountBaseDto {
    private AccountDto accountDto;
}