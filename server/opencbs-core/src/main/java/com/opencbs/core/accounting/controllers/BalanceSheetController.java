package com.opencbs.core.accounting.controllers;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.dto.AccountDto;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.accounting.services.AccountEnrichService;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountingEntryLogService;
import com.opencbs.core.accounting.services.RecalculateBalanceService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.security.permissions.PermissionRequired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/accounting/balance-sheet/")
public class BalanceSheetController {

    private final AccountService accountService;
    private final AccountMapper accountMapper;
    private final AccountingEntryLogService accountingEntryLogService;
    private final AccountEnrichService accountEnrichService;
    private final RecalculateBalanceService recalculateBalanceService;

    public BalanceSheetController(AccountService accountService,
                                  AccountMapper accountMapper,
                                  AccountingEntryLogService accountingEntryLogService,
                                  AccountEnrichService accountEnrichService,
                                  RecalculateBalanceService recalculateBalanceService) {
        this.accountService = accountService;
        this.accountMapper = accountMapper;
        this.accountingEntryLogService = accountingEntryLogService;
        this.accountEnrichService = accountEnrichService;
        this.recalculateBalanceService = recalculateBalanceService;
    }

    @GetMapping(value = "/root")
    public List<AccountDto> getRootAccounts(@RequestParam(value = "date", required = false)
                                            @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime dateTime) {
        User currentUser = UserHelper.getCurrentUser();
        this.accountingEntryLogService.checkActualBalance(currentUser);
        return this.accountEnrichService.enrichWithBalance(dateTime, currentUser)
                .stream()
                .map(this.accountMapper::mapToDetailsDto)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/root/{accountId}/leaves")
    public Page<AccountDto> getLeavesByParent(@PathVariable long accountId,
                                              @RequestParam(value = "date") @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime dateTime,
                                              Pageable pageable) throws ResourceNotFoundException {
        User currentUser = UserHelper.getCurrentUser();
        this.accountingEntryLogService.checkActualBalance(currentUser);
        Account account = this.accountService.findOne(accountId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found(ID=%d).", accountId)));

        return this.accountEnrichService.findLeavesWithBalanceByParent(pageable, account, dateTime, currentUser)
                .map(this.accountMapper::mapToDetailsDto);
    }

    @PostMapping(value = "/recalculateBalances")
    public String recalculateBalances() {
        this.recalculateBalanceService.recalculateBalances();
        return "Balance recalculation is finished";
    }

}
