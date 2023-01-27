package com.opencbs.core.accounting.repositories.customs;

import com.opencbs.core.accounting.domain.AccountBalance;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface AccountBalanceRepositoryCustom {
    List<AccountBalance> getBalance(List<Long> ids, LocalDateTime date);
    void recreateInOutFlow(LocalDate calculateDate);
    void recalculateBalances(LocalDate date);
}
