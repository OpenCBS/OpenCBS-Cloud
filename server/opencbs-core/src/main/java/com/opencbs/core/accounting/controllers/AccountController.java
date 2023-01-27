package com.opencbs.core.accounting.controllers;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountTagType;
import com.opencbs.core.accounting.dto.AccountCreateDto;
import com.opencbs.core.accounting.dto.AccountDto;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountTagService;
import com.opencbs.core.accounting.services.RecalculateBalanceService;
import com.opencbs.core.accounting.validators.AccountValidator;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.audit.HistoryDto;
import com.opencbs.core.dto.requests.AccountRequest;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.dto.RequestDto;
import com.opencbs.core.request.serivce.MakerCheckerWorker;
import com.opencbs.core.security.permissions.PermissionRequired;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/accounting/")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final AccountMapper accountMapper;
    private final AccountValidator accountValidator;
    private final RecalculateBalanceService recalculateBalanceService;
    private final MakerCheckerWorker makerCheckerWorker;
    private final AccountTagService accountTagService;


    @GetMapping(value = "/lookup")
    public Page<AccountDto> getLookup(AccountRequest request, Pageable pageable) throws ResourceNotFoundException {
        return accountService.search(request, pageable).map(this.accountMapper::mapToDto);
    }

    @GetMapping(value = "/payee")
    public Page<AccountDto> getPayeeAccount(Pageable pageable) throws ResourceNotFoundException {
        return accountService.getPayeeAccount(pageable).map(this.accountMapper::mapToDto);
    }

    @GetMapping(value = "/lookup/current-accounts")
    public Page<AccountDto> getCurrentAccounts(String search, Pageable pageable) throws ResourceNotFoundException {
        return accountService.searchCurrentAccounts(search, pageable).map(this.accountMapper::mapToDto);
    }

    @PostMapping(value = "/lookup/by-tags")
    public Page<AccountDto> getAccountsByTags(@RequestBody List<AccountTagType> tags, Pageable pageable) throws ResourceNotFoundException {
        return accountService.searchAccountsByTags(tags, pageable).map(this.accountMapper::mapToDto);
    }

    @GetMapping(value = "/tags")
    public List<AccountTagType> getAccountsTags() throws ResourceNotFoundException {
        return this.accountTagService.getAccountTags();
    }

    @GetMapping(value = "/chart-of-accounts/root")
    public List<AccountDto> getRootAccounts() {
        return this.accountService.findRootAccounts()
                .stream()
                .map(this.accountMapper::mapToDetailsDto)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/chart-of-accounts/root/{accountId}/leaves")
    public Page<AccountDto> getLeavesByParent(@PathVariable long accountId,
                                              Pageable pageable) throws ResourceNotFoundException {
        Account account = this.accountService.findOne(accountId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found(ID=%d).", accountId)));
        return this.accountService.findLeavesByParent(pageable, account).map(this.accountMapper::mapToDetailsDto);
    }

    @GetMapping(value = "/chart-of-accounts/{accountId}")
    public AccountDto getAccountForEdit(@PathVariable Long accountId) {
        Account account = this.accountService.findOne(accountId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found(ID=%d).", accountId)));
        return this.accountMapper.mapToDetailsForEdit(account);
    }

    @GetMapping(value = "/chart-of-accounts/root/branch")
    public List<AccountDto> filterRootByBranch(@RequestParam(value = "branch") long branchId) {
        return this.accountService.findRootAccounts()
                .stream()
                .filter(x -> x.getBranch().getId().equals(branchId))
                .map(this.accountMapper::mapToDetailsDto)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/chart-of-accounts/root/{accountId}/leaves/branch")
    public Page<AccountDto> filterLeavesByBranch(@PathVariable long accountId,
                                                 @RequestParam(value = "branch") long branchId,
                                                 Pageable pageable) throws ResourceNotFoundException {
        Account account = this.accountService.findOne(accountId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found(ID=%d).", accountId)));
        return this.accountService.findLeavesByParentAndBranch(pageable, account, branchId).map(this.accountMapper::mapToDetailsDto);
    }

    @PermissionRequired(name = "MAKER_FOR_ACCOUNT", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @PostMapping(value = "/chart-of-accounts")
    public RequestDto createAccount(@RequestBody AccountCreateDto dto) throws Exception {
        this.accountValidator.validateOnCreate(dto);
        Request request = this.makerCheckerWorker.create(RequestType.ACCOUNT_CREATE, dto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @PermissionRequired(name = "MAKER_FOR_ACCOUNT", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @PutMapping(value = "/chart-of-accounts/{accountId}")
    public RequestDto updateAccount(@PathVariable Long accountId, @RequestBody AccountCreateDto dto) throws Exception {
        Account updatingAccount = this.accountService.findOne(accountId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found(ID=%d).", accountId)));
        this.accountValidator.validateOnUpdate(dto, updatingAccount);
        this.accountService.validateOnUpdate(accountId);
        Request request = this.makerCheckerWorker.create(RequestType.ACCOUNT_EDIT, dto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @PostMapping(value = "/recalculateBalances")
    public String recalculateBalances(@RequestParam(value = "fromDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate) {
        this.recalculateBalanceService.handleRecalculateBalances(fromDate);
        return "Balance recalculation is finished";
    }

    @GetMapping(value = "/get-account-balance/{accountId}")
    public BigDecimal getAccountBalance(@PathVariable Long accountId) {
        return this.accountService.getAccountBalance(accountId, DateHelper.getLocalDateTimeNow());
    }

    @GetMapping(value = "/{id}/history")
    public List<HistoryDto> getHistory(@PathVariable Long id) throws Exception {
        this.accountService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found(ID=%d).", id)));

        return accountService.getAllRevisions(id);
    }

    @GetMapping(value = "/{id}/history/last_change")
    public HistoryDto getLastChange(@PathVariable Long id, @RequestParam(value = "dateTime")  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime ) throws Exception {
        this.accountService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found(ID=%d).", id)));
        return this.accountService.getRevisionByDate(id, dateTime);
    }
}
