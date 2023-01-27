package com.opencbs.loans.dto.products;

import com.opencbs.core.domain.enums.AccountRuleType;
import lombok.Data;

@Data
public class LoanProductAccountBaseDto {
    private AccountRuleType accountRuleType;
}