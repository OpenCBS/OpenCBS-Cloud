package com.opencbs.core.accounting.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.dto.AccountOperationDto;
import com.opencbs.core.accounting.dto.AccountingTransactionDto;
import com.opencbs.core.accounting.dto.SortedAccountingEntryDto;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.accounting.repositories.AccountingEntryLogRepository;
import com.opencbs.core.accounting.repositories.AccountingEntryRepository;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class AccountingEntryService {

    private final AccountingEntryRepository accountingEntryRepository;
    private final AccountingEntryLogRepository accountingEntryLogRepository;
    private final AccountService accountService;
    private final AccountMapper accountMapper;

    @Transactional(isolation = Isolation.READ_UNCOMMITTED)
    public AccountingEntry create(AccountingEntry accountingEntry) {
        return this.accountingEntryRepository.save(accountingEntry);
    }

    public void validateAccountingEntry(AccountingEntry accountingEntry) {
//        if (accountingEntry.getAmount().compareTo(BigDecimal.ZERO) <= 0)
//            throw new RuntimeException("Amount of accounting entry can't be zero or less");

        Account debit = accountingEntry.getDebitAccount();
        Account credit = accountingEntry.getCreditAccount();
        if (!debit.getCurrency().getId().equals(credit.getCurrency().getId()))
            throw new RuntimeException("Accounts have different currencies. Debit - " + debit.getCurrency().getName() + ", Credit - " + credit.getCurrency().getName());
        if (!debit.getIsDebit() && !debit.getValidateOff() && this.accountService.getAccountBalance(debit.getId(), accountingEntry.getEffectiveAt()).compareTo(accountingEntry.getAmount()) < 0)
            throw new RuntimeException("Insufficient funds on account - " + debit.getNumber() + " - " + debit.getName());
        if (credit.getIsDebit() && !credit.getValidateOff() && this.accountService.getAccountBalance(credit.getId(), accountingEntry.getEffectiveAt()).compareTo(accountingEntry.getAmount()) < 0)
            throw new RuntimeException("Insufficient funds on account - " + credit.getNumber() + " - " + credit.getName());
        if (debit.getLocked())
            throw new RuntimeException("Account is locked - " + debit.getNumber() + " - " + debit.getName());
        if (credit.getLocked())
            throw new RuntimeException("Account is locked - " + credit.getNumber() + " - " + credit.getName());
    }

    @Transactional(isolation = Isolation.READ_UNCOMMITTED)
    public List<AccountingEntry> create(List<AccountingEntry> accountingEntries) {
        for (AccountingEntry accountingEntry : accountingEntries) {
            this.create(accountingEntry);
        }
        return accountingEntries;
    }

    public Page<AccountingEntry> findAll(Pageable pageable) {
        return this.accountingEntryRepository.findAllByDeletedIsFalse(pageable);
    }

    public AccountingEntry findById(Long id) {
        return this.accountingEntryRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Accounting entry not found(ID=%d).", id)));
    }

    public Page<AccountingEntry> getAll(SortedAccountingEntryDto sortedAccountingEntryDto, Pageable pageable) {
        if (sortedAccountingEntryDto.getAccountId() != null) {
            List<Long> accounts = new ArrayList<>();
            AccountType type = this.accountService.getAccountTypeByAccountId(sortedAccountingEntryDto.getAccountId());
            if (type.equals(AccountType.SUBGROUP)){
                accounts.addAll(this.accountService.findAllAccountByParentId(sortedAccountingEntryDto.getAccountId()));
            } else {
                accounts.add(sortedAccountingEntryDto.getAccountId());
            }
            return this.accountingEntryRepository.getAll(sortedAccountingEntryDto, pageable, accounts);
        }
        return this.accountingEntryRepository.getAll(sortedAccountingEntryDto, pageable);
    }

    public Page<AccountOperationDto> findAccountOperations(Account account,
                                                           Pageable pageable,
                                                           LocalDate from,
                                                           LocalDate to) {
        BigDecimal accountBalance =
                this.accountService.getAccountBalance(account.getId(), LocalDateTime.of(from, LocalTime.MIN));

        List<AccountingEntry> accountingEntryList =
                this.accountingEntryRepository.getAccountingEntriesByAccount(
                        account,
                        LocalDateTime.of(from, LocalTime.MIN),
                        LocalDateTime.of(to, LocalTime.MAX));

        accountingEntryList.sort(Comparator.comparing(AccountingEntry::getEffectiveAt));

        List<AccountOperationDto> operationDtos = new ArrayList<>();
        for (int i = 0; i < pageable.getPageNumber() * pageable.getPageSize() + pageable.getPageSize(); i++) {
            if (i >= accountingEntryList.size())
                break;

            AccountingEntry accountingEntry = accountingEntryList.get(i);
            AccountOperationDto accountOperationDto = new AccountOperationDto();
            accountOperationDto.setDate(accountingEntry.getEffectiveAt());
            if (accountingEntry.getExtra() != null) {
                accountOperationDto.setDocumentNumber(accountingEntry.getExtra().values()
                        .stream()
                        .findFirst().get().toString());
            }

            if (account.getId().equals(accountingEntry.getCreditAccount().getId())) {
                accountOperationDto.setSource(this.accountMapper.mapToDto(accountingEntry.getDebitAccount()));
            } else {
                accountOperationDto.setSource(this.accountMapper.mapToDto(accountingEntry.getCreditAccount()));
            }

            accountOperationDto.setId(accountingEntry.getId());
            accountOperationDto.setDescription(accountingEntry.getDescription());
            if (account.getIsDebit()) {
                if (accountingEntry.getDebitAccount().equals(account)) {
                    accountOperationDto.setDeposit(accountingEntry.getAmount());
                    accountBalance = accountBalance.add(accountingEntry.getAmount());
                } else {
                    accountOperationDto.setWithdraw(accountingEntry.getAmount());
                    accountBalance = accountBalance.subtract(accountingEntry.getAmount());
                }
            } else {
                if (accountingEntry.getCreditAccount().equals(account)) {
                    accountOperationDto.setDeposit(accountingEntry.getAmount());
                    accountBalance = accountBalance.add(accountingEntry.getAmount());
                } else {
                    accountOperationDto.setWithdraw(accountingEntry.getAmount());
                    accountBalance = accountBalance.subtract(accountingEntry.getAmount());
                }
            }

            accountOperationDto.setBalance(accountBalance);
            operationDtos.add(accountOperationDto);
        }

        operationDtos = operationDtos.stream()
                .skip(pageable.getPageNumber() * pageable.getPageSize())
                .limit(pageable.getPageSize())
                .sorted(Comparator.comparing(AccountOperationDto::getDate, Comparator.reverseOrder())
                        .thenComparing(AccountOperationDto::getId, Comparator.reverseOrder()))
                .collect(Collectors.toList());
        return new PageImpl<>(operationDtos, pageable, accountingEntryList.size());
    }

    public AccountingEntry transferTo(AccountingTransactionDto dto, Account account, User currentUser) {
        AccountingEntry accountingEntry = this.createEntry(dto, currentUser);
        accountingEntry.setCreditAccount(this.accountService.findOne(dto.getAccountId()).get());
        accountingEntry.setDebitAccount(account);
        return create(accountingEntry);
    }

    private AccountingEntry createEntry(AccountingTransactionDto dto, User currentUser) {
        AccountingEntry accountingEntry = new AccountingEntry();

        ExtraJson extraJson = new ExtraJson();
        extraJson.put("documentNumber", dto.getDocumentNumber());

        accountingEntry.setExtra(extraJson);
        accountingEntry.setDescription(dto.getDescription());
        accountingEntry.setAmount(dto.getAmount());
        accountingEntry.setCreatedAt(DateHelper.getLocalDateTimeNow());
        accountingEntry.setEffectiveAt(DateHelper.getLocalDateTimeNow());
        accountingEntry.setCreatedBy(currentUser);
        accountingEntry.setBranch(currentUser.getBranch());
        accountingEntry.setDeleted(false);
        return accountingEntry;
    }

    public AccountingEntry transferFrom(AccountingTransactionDto dto, Account account, User currentUser) {
        AccountingEntry accountingEntry = this.createEntry(dto, currentUser);
        accountingEntry.setCreditAccount(account);
        accountingEntry.setDebitAccount(this.accountService.findOne(dto.getAccountId()).get());
        return create(accountingEntry);
    }

    public AccountingEntry getAccountingEntry(LocalDateTime dateTime,
                                              BigDecimal amount,
                                              Account debit,
                                              Account credit,
                                              Branch branch,
                                              String comment,
                                              User currentUser,
                                              ExtraJson extra) {
        AccountingEntry accountingEntry = new AccountingEntry();
        accountingEntry.setAmount(amount);
        accountingEntry.setDebitAccount(debit);
        accountingEntry.setCreditAccount(credit);
        accountingEntry.setDeleted(false);
        accountingEntry.setBranch(branch);
        accountingEntry.setCreatedBy(currentUser);
        accountingEntry.setDescription(comment);
        accountingEntry.setCreatedAt(DateHelper.getLocalDateTimeNow());
        accountingEntry.setEffectiveAt(dateTime);
        accountingEntry.setExtra(extra);
        return accountingEntry;
    }

    public List<AccountingEntry> getAccountingEntriesByAccount(Account account, LocalDateTime from, LocalDateTime to) {
        return this.accountingEntryRepository.getAccountingEntriesByAccount(account, from, to);
    }

    public AccountingEntry save(AccountingEntry accountingEntry) {
        return this.accountingEntryRepository.save(accountingEntry);
    }

    public List<AccountingEntry> save(List<AccountingEntry> accountingEntries) {
        return this.accountingEntryRepository.save(accountingEntries);
    }
}
