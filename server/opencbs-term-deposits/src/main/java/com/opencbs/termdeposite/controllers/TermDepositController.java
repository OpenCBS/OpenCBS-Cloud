package com.opencbs.termdeposite.controllers;

import com.opencbs.core.accounting.dto.AccountingEntryDto;
import com.opencbs.core.accounting.mappers.AccountingMapper;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.ActualizeHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.dto.GetTermDepositDetailsDto;
import com.opencbs.termdeposite.dto.TermDepositDetailsDto;
import com.opencbs.termdeposite.dto.TermDepositDto;
import com.opencbs.termdeposite.dto.TermDepositSimplified;
import com.opencbs.termdeposite.mapper.TermDepositMapper;
import com.opencbs.termdeposite.services.TermDepositCloseInterface;
import com.opencbs.termdeposite.work.TermDepositWork;
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

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping(value = "/api/term-deposits")
@SuppressWarnings("unused")
public class TermDepositController {

    private final TermDepositWork termDepositWork;
    private final TermDepositMapper termDepositMapper;
    private final AccountingMapper accountingMapper;
    private final TermDepositCloseInterface termDepositCloseInterface;

    @Autowired
    public TermDepositController(@NonNull TermDepositWork termDepositWork,
                                 @NonNull TermDepositMapper termDepositMapper,
                                 @NonNull AccountingMapper accountingMapper,
                                 @NonNull TermDepositCloseInterface termDepositCloseInterface) {
        this.termDepositWork = termDepositWork;
        this.termDepositMapper = termDepositMapper;
        this.accountingMapper = accountingMapper;
        this.termDepositCloseInterface = termDepositCloseInterface;
    }

    @PermissionRequired(name = "TERM_DEPOSIT_CREATE", moduleType = ModuleType.TERM_DEPOSITS, description = "")
    @PostMapping
    public TermDepositDetailsDto create(@RequestBody TermDepositDto dto) throws Exception {
        return this.termDepositWork.create(dto, UserHelper.getCurrentUser());
    }

    @PermissionRequired(name = "TERM_DEPOSIT_UPDATE", moduleType = ModuleType.TERM_DEPOSITS, description = "")
    @PutMapping(value = "/{id}")
    public TermDepositDetailsDto update(@NonNull @PathVariable Long id, @RequestBody TermDepositDto dto) throws ResourceNotFoundException {
        return this.termDepositWork.update(id, dto);
    }

    @PermissionRequired(name = "TERM_DEPOSIT_OPEN", moduleType = ModuleType.TERM_DEPOSITS, description = "")
    @PostMapping(value = "/{id}/open")
    public TermDepositDetailsDto open(@NonNull @PathVariable Long id,
                                      @NonNull @RequestParam(value = "initialAmount") BigDecimal amount,
                                      @NonNull @RequestParam(value = "openDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate openDate) throws ResourceNotFoundException {
        return this.termDepositMapper.mapToDetailDto(this.termDepositWork.open(id, openDate, amount, UserHelper.getCurrentUser(), false));
    }

    @PermissionRequired(name = "TERM_DEPOSIT_CLOSE", moduleType = ModuleType.TERM_DEPOSITS, description = "")
    @PostMapping(value = "/{id}/close")
    public TermDepositDetailsDto close(@PathVariable Long id,
                                       @NonNull @RequestParam(value = "closeDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        ActualizeHelper.isActualized(id, ModuleType.TERM_DEPOSITS, closeDate);
        return termDepositMapper.mapToDetailDto(this.termDepositCloseInterface.close(id, closeDate));
    }

    @PermissionRequired(name = "TERM_DEPOSIT_LOCK", moduleType = ModuleType.TERM_DEPOSITS, description = "")
    @PostMapping(value = "/{termDepositId}/lock-unlock")
    public TermDepositDetailsDto lockingAndUnlocking(@PathVariable Long termDepositId) {
        ActualizeHelper.isActualized(termDepositId, ModuleType.TERM_DEPOSITS, LocalDate.now());
        return this.termDepositMapper.mapToDetailDto(this.termDepositWork.lockAndUnlock(termDepositId));
    }

    @GetMapping
    public Page<TermDepositSimplified> getAll(@RequestParam(value = "search", required = false) String searchString,
                                              Pageable pageable) {
        return this.termDepositWork.getAll(searchString, pageable);
    }

    @GetMapping(value = "/{id}")
    public GetTermDepositDetailsDto get(@PathVariable Long id) throws ResourceNotFoundException {
        return this.termDepositMapper.mapToGetDetailDto(this.termDepositWork.getById(id));
    }

    @GetMapping(value = "/by-profile/{profileId}")
    public Page<GetTermDepositDetailsDto> getAllByProfile(@PathVariable Long profileId,
                                                          Pageable pageable) throws ResourceNotFoundException {
        return this.termDepositWork.findAllByProfileId(profileId, pageable).map(this.termDepositMapper::mapToGetDetailDto);
    }

    @GetMapping(value = "/{termDepositId}/entries")
    public Page<AccountingEntryDto> getEntries(@PathVariable Long termDepositId, Pageable pageable) {
        return this.termDepositWork.getAccountingEntriesByTermDepositId(termDepositId, pageable).map(this.accountingMapper::mapToDto);
    }

    @PermissionRequired(name = "ACTUALIZE_TERM_DEPOSIT", moduleType = ModuleType.TERM_DEPOSITS, description = "")
    @PostMapping(value = "/actualize/{termDepositId}")
    public String actualizingProgress(@PathVariable Long termDepositId,
                                              @RequestParam(value = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        TermDeposit termDeposit = this.termDepositWork.getExistingTermDepositById(termDepositId);
        this.termDepositWork.actualize(termDeposit, date, UserHelper.getCurrentUser());
        return "Actualize term deposit started";
    }
}
