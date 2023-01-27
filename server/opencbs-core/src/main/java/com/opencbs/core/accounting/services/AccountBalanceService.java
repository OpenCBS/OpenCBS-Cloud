package com.opencbs.core.accounting.services;

import com.opencbs.core.accounting.domain.AccountAdditionalInformation;
import com.opencbs.core.accounting.domain.AccountBalance;
import com.opencbs.core.accounting.repositories.AccountAdditionalInformationRepository;
import com.opencbs.core.accounting.repositories.AccountBalanceRepository;
import com.opencbs.core.accounting.repositories.AccountingEntryForCalculateBalanceRepository;
import com.opencbs.core.annotations.TimeLog;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor

@Service
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class AccountBalanceService {

    private final AccountBalanceRepository accountBalanceRepository;
    private final AccountAdditionalInformationRepository accountAdditionalInformationRepository;
    private final AccountingEntryForCalculateBalanceRepository accountingEntryForCalculateBalanceRepository;
    private final AccountService accountService;
    private final Map<Long, AccountAdditionalInformation> additionalInformationOfAccount = new HashMap<>();


    public List<AccountBalance> getAccountBalances(List<Long> ids, @NonNull LocalDateTime dateTime) { //TODO DO NOT USE this method for balance calculation!
        LocalDateTime dateForBalance = LocalDateTime.of(dateTime.toLocalDate(), LocalTime.MAX);
        return this.accountBalanceRepository.getBalance(ids, dateForBalance);
    }

    @TimeLog
    public Optional<AccountBalance> create(Long accountId, BigDecimal amount, LocalDate date, Boolean fromDebit) {
        if (BigDecimal.ZERO.compareTo(amount)==0) {
            return Optional.empty();
        }

        if (!additionalInformationOfAccount.containsKey(accountId)) {
            additionalInformationOfAccount.put(accountId, accountAdditionalInformationRepository.findOne(accountId));
        }

        return Optional.of(updateAccountBalance(accountId, amount, date.atTime(LocalTime.MAX), fromDebit));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteAllByDateEqualOrAfter(LocalDateTime localDateTime) {
        accountBalanceRepository.deleteAllByDateEqualsOrDateAfter(localDateTime, localDateTime);
    }

    private AccountBalance updateAccountBalance(@NonNull Long accountId,
                                      @NonNull BigDecimal entryAmount,
                                      @NonNull LocalDateTime date,
                                      boolean fromDebit) {
        Optional<AccountBalance> lastBalance = accountBalanceRepository.findFirstByAccountIdAndDateLessThanEqualOrderByDateDesc(accountId, date);
        AccountBalance accountBalance;
        if (lastBalance.isPresent() && lastBalance.get().getDate().isEqual(date)) {
            accountBalance = lastBalance.get();
            accountBalance.setBalance(calculateBalanceAmount(accountId, accountBalance.getBalance(), entryAmount, fromDebit));

            return accountBalance;
        }
        accountBalance = AccountBalance.builder()
                .accountId(accountId)
                .balance(
                    calculateBalanceAmount(accountId,
                        lastBalance.map(AccountBalance::getBalance).orElse(BigDecimal.ZERO), entryAmount, fromDebit)
                )
                .date(date)
                .build();
        return accountBalance;
    }

    private BigDecimal calculateBalanceAmount(@NonNull Long accountId,
                                              @NonNull BigDecimal lastAmount,
                                              @NonNull BigDecimal amount,
                                              boolean fromDebit) {
        if (!additionalInformationOfAccount.containsKey(accountId)) {
            additionalInformationOfAccount.put(accountId, accountAdditionalInformationRepository.findOne(accountId));
        }

        Boolean isDebit = additionalInformationOfAccount.get(accountId).getIsDebit();
        if (fromDebit) {
            return isDebit
                    ? lastAmount.add(amount)
                    : lastAmount.subtract(amount);
        }

        return isDebit
                ? lastAmount.subtract(amount)
                : lastAmount.add(amount);
    }

    public Optional<AccountBalance> getAccountBalance(@NonNull Long accountId, @NonNull LocalDateTime accountDateTime) {
        return accountBalanceRepository.findByAccountIdAndDate(accountId, accountDateTime);
    }

    private void buildBalanceByParentAccounts(List<AccountBalance> accountBalances, LocalDate localDate) {
        this.fillWithParentIds(accountBalances);

        Set<Long> parentIds = accountBalances.stream()
                .filter(accountBalance -> accountBalance.getParentId()!=null)
                .map(ab->ab.getParentId())
                .collect(Collectors.toSet());

        if (parentIds.isEmpty()) {
            return;
        }

        List<AccountBalance> balances = new ArrayList<>();
        for (Long parentId : parentIds) {
            List<Long> childIds = this.accountService.getAllChildIds(parentId);
            BigDecimal balance = this.getAccountBalances(childIds, localDate.atTime(LocalTime.MAX))
                    .stream()
                    .map(ab -> ab.getBalance())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            AccountBalance parentBalance = new AccountBalance();
            parentBalance.setAccountId(parentId);
            parentBalance.setBalance(balance);
            parentBalance.setDate(LocalDateTime.of(localDate, LocalTime.MAX));
            balances.add(parentBalance);
        }

        this.accountBalanceRepository.save(balances);
        buildBalanceByParentAccounts(balances, localDate);
    }

    private void fillWithParentIds(List<AccountBalance> accountBalances) {
        List<Long> accountIds = accountBalances
                .stream()
                .mapToLong(AccountBalance::getAccountId)
                .boxed()
                .collect(Collectors.toList());
        Map<Long, Long> parentAccounts = this.accountService.findParentAccounts(accountIds);

        accountBalances.forEach(ab->ab.setParentId(parentAccounts.get(ab.getAccountId())));
    }

    private List<AccountBalance> buildBalanceByGroupRecords(Map<Long, BigDecimal> accountEntries, LocalDate localDate, Boolean isDebit) {
        if (accountEntries.isEmpty()){
            return Collections.EMPTY_LIST;
        }

        List<AccountBalance> accountBalances = new ArrayList<>();
        for(Map.Entry<Long, BigDecimal> accountEntry : accountEntries.entrySet()) {
            Optional<AccountBalance> accountBalance = this.create(accountEntry.getKey(), accountEntry.getValue(), localDate, isDebit);
            if (accountBalance.isPresent()){
                accountBalances.add(accountBalance.get());
            }
        }

        return accountBalances;
    }

    public void createInOutCashFlow(LocalDate calculateDate){
        log.info("Recalculate of Cash Flow to {} start", calculateDate);
        this.accountBalanceRepository.recreateInOutFlow(calculateDate);
        log.info("Recalculate of Cash Flow to {} end", calculateDate);
    }

    public void recalculateBalances(LocalDate date) {
        log.info("Recalculate of balances to {} start", date);
        this.accountBalanceRepository.recalculateBalances(date);
        log.info("Recalculate of balances to {} end", date);
    }
}
