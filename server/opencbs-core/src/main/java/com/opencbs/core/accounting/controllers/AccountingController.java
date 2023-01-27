package com.opencbs.core.accounting.controllers;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.dto.AccountOperationDto;
import com.opencbs.core.accounting.dto.AccountingEntryDto;
import com.opencbs.core.accounting.dto.AccountingTransactionDto;
import com.opencbs.core.accounting.dto.AccountingTransactionExtDto;
import com.opencbs.core.accounting.dto.MultipleTransactionDto;
import com.opencbs.core.accounting.dto.SortedAccountingEntryDto;
import com.opencbs.core.accounting.mappers.AccountingMapper;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.accounting.validators.AccountingValidator;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.workers.AccountingEntryWorker;
import com.opencbs.core.workers.impl.AccountingEntryWorkerImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/accounting")
public class AccountingController {

    private final AccountingEntryService accountingEntryService;
    private final AccountService accountService;
    private final AccountingMapper accountingMapper;
    private final AccountingValidator accountingValidator;
    private final AccountingEntryWorker accountingEntryWorker;


    @GetMapping(value = "/entries")
    public Page<AccountingEntryDto> getEntries(SortedAccountingEntryDto sortedAccountingEntryDto, Pageable pageable) {
        return this.accountingEntryService.getAll(sortedAccountingEntryDto, pageable).map(this.accountingMapper::mapToDto);
    }

    @PostMapping(value = "/entry")
    public AccountingEntryDto create(@RequestBody AccountingTransactionExtDto dto) throws Exception {
        this.accountingValidator.validateOnCreate(dto);
        AccountingEntry mapped = this.accountingMapper.mapToEntity(dto, UserHelper.getCurrentUser());
        mapped.setEffectiveAt(LocalDateTime.of(mapped.getCreatedAt().toLocalDate(), DateHelper.getLocalTimeNow()));
        mapped.setCreatedAt(DateHelper.getLocalDateTimeNow());
        AccountingEntry created = this.accountingEntryService.create(mapped);
        return this.accountingMapper.mapToDto(created);
    }

    @GetMapping(value = "/accounts/{id}/operations")
    public Page<AccountOperationDto> getOperations(@PathVariable long id,
                                                   Pageable pageable,
                                                   @RequestParam(name = "from")
                                                   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                                   @RequestParam(name = "to")
                                                   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) throws ResourceNotFoundException {
        Account account = this.accountService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found (ID=%d).", id)));

        return this.accountingEntryService.findAccountOperations(account, pageable, from, to);
    }

    @PostMapping(value = "/accounts/{id}/transfer-to")
    public AccountingEntryDto transferToCurrentAccount(@PathVariable long id,
                                                       @RequestBody AccountingTransactionDto dto) {
        this.accountingValidator.validateOnTransfer(dto);
        Account currentAccount = this.accountService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found (ID=%d).", id)));

        AccountingEntry accountingEntry = this.accountingEntryService.transferTo(dto, currentAccount, UserHelper.getCurrentUser());
        return this.accountingMapper.mapToDto(accountingEntry);
    }

    @PostMapping(value = "/accounts/{id}/transfer-from")
    public AccountingEntryDto transferFromCurrentAccount(@PathVariable long id,
                                                         @RequestBody AccountingTransactionDto dto) {
        this.accountingValidator.validateOnTransfer(dto);
        Account currentAccount = this.accountService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found (ID=%d).", id)));

        AccountingEntry accountingEntry = this.accountingEntryService.transferFrom(dto, currentAccount, UserHelper.getCurrentUser());
        return this.accountingMapper.mapToDto(accountingEntry);
    }

    @RequestMapping(value = "/multiple/printReceipt")
    public ResponseEntity printReceipt(@RequestBody MultipleTransactionDto multipleTransactionDto) {
        return this.accountingEntryWorker.printReceipt(multipleTransactionDto);
    }

    @PostMapping(value = "/multiple")
    public List<AccountingEntryDto> multipleTransaction(@RequestBody MultipleTransactionDto multipleTransactionDto) {
        return this.accountingEntryWorker.makeMultipleTransaction(multipleTransactionDto).stream()
                .map(this.accountingMapper::mapToDto)
                .collect(Collectors.toList());
    }
}
