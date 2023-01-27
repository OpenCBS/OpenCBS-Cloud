package com.opencbs.savings.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.savings.domain.Saving;
import com.opencbs.savings.domain.SavingAccount;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;

public interface SavingAccountGenerator {

    SavingAccount getAccount(Saving saving, Account account, SavingAccountRuleType savingAccountRuleType);
}
