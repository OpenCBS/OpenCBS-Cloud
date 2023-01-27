package com.opencbs.termdeposite.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.termdeposite.domain.enums.TermDepositAccountType;

public interface TermDepositAccountService {

    Account getTermDepositAccount(Long termDepositId, TermDepositAccountType type);
}
