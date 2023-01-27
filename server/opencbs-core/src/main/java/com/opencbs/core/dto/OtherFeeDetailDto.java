package com.opencbs.core.dto;

import com.opencbs.core.accounting.dto.AccountDto;
import lombok.Data;

@Data
public class OtherFeeDetailDto extends OtherFeeDto{

    private AccountDto chargeAccount;

    private AccountDto incomeAccount;

    private AccountDto expenseAccount;
}
