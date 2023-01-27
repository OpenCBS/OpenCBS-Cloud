package com.opencbs.core.accounting.services;

import com.opencbs.core.accounting.domain.AccountingEntryLog;
import com.opencbs.core.accounting.repositories.AccountingEntryLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor

@Slf4j
@Service
public class RecalculateBalanceService {

    private final AccountingEntryLogRepository accountingEntryLogRepository;
    private final AccountBalanceService accountBalanceService;


    public void recalculateBalances() {
        List<AccountingEntryLog> allByHandledFalse = this.accountingEntryLogRepository.findAllByHandledFalse();
        Set<LocalDate> dates = allByHandledFalse.stream()
                .map(AccountingEntryLog::getEffectiveDate)
                .map(dt -> dt.toLocalDate())
                .collect(Collectors.toSet());
        dates.forEach(dt->this.recalculate(dt));
    }

    public void handleRecalculateBalances(LocalDate fromDate) {
        recalculate(fromDate);
    }

    private void recalculate(LocalDate date) {
        this.accountBalanceService.recalculateBalances(date);
        this.accountBalanceService.createInOutCashFlow(date);
        this.accountingEntryLogRepository.deleteAllByEffectiveDateBetween(LocalDateTime.of(date, LocalTime.MIN), LocalDateTime.of(date, LocalTime.MAX));
    }
}
