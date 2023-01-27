package com.opencbs.borrowings.dto;

import com.opencbs.core.accounting.dto.AccountDto;
import com.opencbs.borrowings.domain.enums.BorrowingRuleType;
import lombok.Data;

@Data
public class BorrowingProductAccountDetailsDto {
    private BorrowingRuleType accountRuleType;
    private AccountDto accountDto;
}