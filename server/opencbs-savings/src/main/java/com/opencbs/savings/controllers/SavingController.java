package com.opencbs.savings.controllers;

import com.opencbs.core.accounting.dto.AccountingEntryDto;
import com.opencbs.core.accounting.mappers.AccountingMapper;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.ActualizeHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.savings.domain.Saving;
import com.opencbs.savings.domain.SavingSimplified;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import com.opencbs.savings.dto.SavingDetailsDto;
import com.opencbs.savings.dto.SavingDto;
import com.opencbs.savings.mappers.SavingMapper;
import com.opencbs.savings.services.*;
import com.opencbs.savings.validators.SavingValidator;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

import javax.script.ScriptException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping(value = "/api/savings")
@SuppressWarnings("unused")
public class SavingController {

    private final SavingValidator savingValidator;
    private final SavingMapper savingMapper;
    private final SavingWorker savingWorker;
    private final SavingService savingService;
    private final AccountingMapper accountingMapper;
    private final ActualizeSavingStarterService actualizeSavingStarterService;
    private final SavingCloseInterface savingCloseInterface;
    private final SavingAccountingService savingAccountingService;

    @Autowired
    public SavingController(SavingValidator savingValidator,
                            SavingMapper savingMapper,
                            SavingWorker savingWorker,
                            SavingService savingService,
                            AccountingMapper accountingMapper,
                            ActualizeSavingStarterService actualizeSavingStarterService,
                            SavingCloseInterface savingCloseInterface,
                            SavingAccountingService savingAccountingService) {
        this.savingValidator = savingValidator;
        this.savingMapper = savingMapper;
        this.savingWorker = savingWorker;
        this.savingService = savingService;
        this.accountingMapper = accountingMapper;
        this.actualizeSavingStarterService = actualizeSavingStarterService;
        this.savingCloseInterface = savingCloseInterface;
        this.savingAccountingService = savingAccountingService;
    }

    @PermissionRequired(name = "SAVINGS_CREATE", moduleType = ModuleType.SAVINGS, description = "")
    @PostMapping
    public SavingDetailsDto create(@RequestBody SavingDto dto) throws ScriptException, ResourceNotFoundException {
        this.savingValidator.validate(dto);
        return this.savingMapper.mapToDto(this.savingService.create(this.savingMapper.mapToEntity(dto), UserHelper.getCurrentUser()));
    }

    @PermissionRequired(name = "SAVINGS_UPDATE", moduleType = ModuleType.SAVINGS, description = "")
    @PutMapping(value = "/{id}")
    public SavingDetailsDto update(@PathVariable Long id, @RequestBody SavingDto dto) throws ScriptException, ResourceNotFoundException {
        Saving saving = this.savingService.findById(id);
        this.savingValidator.validate(dto);
        return this.savingMapper.mapToDto(this.savingService.update(this.savingMapper.zip(saving, dto)));
    }

    @PermissionRequired(name = "SAVING_OPEN", moduleType = ModuleType.SAVINGS, description = "")
    @PostMapping(value = "/{id}/open")
    public SavingDetailsDto open(@PathVariable Long id,
                                 @RequestParam(value = "initialAmount") BigDecimal amount) throws ResourceNotFoundException {
        Saving saving = this.savingService.findById(id);
        this.savingValidator.validateOnOpen(amount, saving.getProduct());
        return this.savingMapper.mapToDto(this.savingService.open(amount, saving, UserHelper.getCurrentUser()));
    }

    @PermissionRequired(name = "SAVING_CLOSE", moduleType = ModuleType.SAVINGS, description = "")
    @PostMapping(value = "/{id}/close")
    public SavingDetailsDto close(@PathVariable Long id,
                                  @NonNull @RequestParam(value = "closeDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        ActualizeHelper.isActualized(id, ModuleType.SAVINGS, closeDate);
        Saving saving = this.savingService.findById(id);
        this.savingValidator.validateOnDate(saving.getOpenDate(), closeDate.atTime(LocalTime.MIN));
        return this.savingMapper.mapToDto(this.savingCloseInterface.close(saving, closeDate));
    }

    @PermissionRequired(name = "SAVING_DEPOSIT", moduleType = ModuleType.SAVINGS, description = "")
    @PostMapping(value = "/{id}/deposit")
    public SavingDetailsDto deposit(@PathVariable Long id,
                                    @RequestParam(value = "amount") BigDecimal amount,
                                    @RequestParam(value = "date") @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime date) {
        Saving saving = this.savingService.findById(id);
        this.savingValidator.validateDepositAmount(amount, saving);
        this.savingValidator.validateOnDate(saving.getOpenDate(), date);
        return this.savingMapper.mapToDto(this.savingService.deposit(saving, amount, date, UserHelper.getCurrentUser()));
    }

    @PermissionRequired(name = "SAVING_WITHDRAW", moduleType = ModuleType.SAVINGS, description = "")
    @PostMapping(value = "/{id}/withdraw")
    public SavingDetailsDto withdraw(@PathVariable Long id,
                                     @RequestParam(value = "amount") BigDecimal amount,
                                     @RequestParam(value = "date") @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime date) {
        Saving saving = this.savingService.findById(id);
        this.savingValidator.validateWithdrawAmount(amount, saving);
        this.savingValidator.validateOnDate(saving.getOpenDate(), date);
        return this.savingMapper.mapToDto(this.savingService.withdraw(saving, amount, date, UserHelper.getCurrentUser()));
    }

    @PermissionRequired(name = "SAVING_LOCK", moduleType = ModuleType.SAVINGS, description = "")
    @PostMapping(value = "/{id}/lock")
    public SavingDetailsDto locking(@PathVariable Long id) {
        ActualizeHelper.isActualized(id, ModuleType.SAVINGS, LocalDate.now());
        Saving saving = this.savingService.findById(id);
        return this.savingMapper.mapToDto(this.savingWorker.lock(saving));
    }

    @PermissionRequired(name = "GET_SAVINGS", moduleType = ModuleType.SAVINGS, description = "")
    @GetMapping
    public Page<SavingSimplified> getAll(@RequestParam(value = "search", required = false) String searchString,
                                         Pageable pageable) {
        return this.savingService.getAll(searchString, pageable);
    }

    @GetMapping(value = "/{id}")
    public SavingDetailsDto get(@PathVariable Long id) throws ResourceNotFoundException {
        return this.savingMapper.mapToDto(this.savingService.findById(id));
    }

    @GetMapping(value = "/get-saving-account-id/{id}")
    public Long getSavingAccountId(@PathVariable Long id) throws ResourceNotFoundException {
        return this.savingService.findById(id).getAccounts().stream()
                .filter(x -> x.getType().equals(SavingAccountRuleType.SAVING))
                .findFirst()
                .get()
                .getAccount()
                .getId();
    }

    @GetMapping(value = "/by-profile/{profileId}")
    public Page<SavingDetailsDto> getAllByProfile(@PathVariable Long profileId,
                                                  Pageable pageable) throws ResourceNotFoundException {
        return this.savingService.findAllByProfileId(pageable, profileId).map(this.savingMapper::mapToDto);
    }

    @GetMapping(value = "/{id}/entries")
    public Page<AccountingEntryDto> getSavingEntries(@PathVariable Long id, Pageable pageable) {
        return this.savingAccountingService.getAccountingEntriesBySavingId(id, pageable).map(this.accountingMapper::mapToDto);
    }

    @PermissionRequired(name = "ACTUALIZE_SAVING", moduleType = ModuleType.SAVINGS, description = "")
    @PostMapping(value = "/actualize/{savingId}")
    public String getActualizeSavingsProgress(@PathVariable long savingId,
                                           @RequestParam(value = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        this.actualizeSavingStarterService.actualizing(savingId, date, UserHelper.getCurrentUser());
        return "Actualize saving started";
    }
}
