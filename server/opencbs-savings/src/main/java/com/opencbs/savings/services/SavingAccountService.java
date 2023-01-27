package com.opencbs.savings.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;

public interface SavingAccountService {

    Account getSavingAccount(Long savingId, SavingAccountRuleType type);
}
