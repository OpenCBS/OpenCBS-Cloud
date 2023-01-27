package com.opencbs.termdeposite.dto;

import com.opencbs.core.accounting.dto.AccountDetailsDto;
import com.opencbs.termdeposite.domain.enums.TermDepositAccountType;
import lombok.Data;

@Data
public class TermDepositProductAccountDetailsDto {
    private TermDepositAccountType accountRuleType;
    private AccountDetailsDto accountDto;
}