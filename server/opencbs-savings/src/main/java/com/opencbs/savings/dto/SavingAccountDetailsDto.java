package com.opencbs.savings.dto;

import com.opencbs.core.accounting.dto.AccountDetailsDto;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;

import java.util.HashMap;

public class SavingAccountDetailsDto extends HashMap<SavingAccountRuleType, AccountDetailsDto> {
}