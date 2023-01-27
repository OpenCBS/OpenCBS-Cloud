package com.opencbs.termdeposite.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.domain.TermDepositAccount;
import com.opencbs.termdeposite.domain.enums.TermDepositAccountType;

import java.util.List;

public interface TermDepositAccountingService {

    List<TermDepositAccount> createAccounts(TermDeposit termDeposit);
    Account getAccountByType(List<TermDepositAccount> accounts, TermDepositAccountType type);
}
