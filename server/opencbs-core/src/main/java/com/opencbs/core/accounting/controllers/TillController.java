package com.opencbs.core.accounting.controllers;

import com.opencbs.core.accounting.dto.AccountBalanceDto;
import com.opencbs.core.accounting.dto.TillDetailsDto;
import com.opencbs.core.accounting.dto.TillDto;
import com.opencbs.core.accounting.mappers.TillMapper;
import com.opencbs.core.accounting.services.TillService;
import com.opencbs.core.accounting.validators.TillValidator;
import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.till.Till;
import com.opencbs.core.dto.OperationDetailsDto;
import com.opencbs.core.dto.OperationDto;
import com.opencbs.core.dto.TransferDto;
import com.opencbs.core.exceptions.ApiException;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.security.permissions.PermissionRequired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(value = "/api/tills")
public class TillController extends BaseController {

    private final TillService tillService;
    private final TillValidator tillValidator;
    private final TillMapper tillMapper;

    @Autowired
    public TillController(TillService tillService,
                          TillValidator tillValidator,
                          TillMapper tillMapper) {
        this.tillService = tillService;
        this.tillValidator = tillValidator;
        this.tillMapper = tillMapper;
    }

    @GetMapping()
    public Page<TillDetailsDto> get(Pageable pageable, @RequestParam(value = "search", required = false) String searchString) {
        return this.tillService.findAll(pageable, searchString).map(this.tillMapper::mapToDto);
    }

    @GetMapping(value = "/{id}")
    public TillDetailsDto get(@PathVariable Long id) throws ResourceNotFoundException {
        Till till = this.getTill(id);
        return this.tillMapper.mapToDto(till);
    }

    @PostMapping()
    public TillDetailsDto post(@RequestBody TillDto tillDto) throws ApiException {
        this.tillValidator.validateOnCreate(tillDto);
        Till till = this.tillMapper.mapToEntity(tillDto);
        till.setLastChangedBy(UserHelper.getCurrentUser());
        till = this.tillService.create(till);
        return this.tillMapper.mapToDto(till);
    }

    @PutMapping(value = "/{id}")
    public TillDetailsDto put(@PathVariable Long id, @RequestBody TillDto tillDto) throws ApiException {
        tillDto.setId(id);
        this.tillValidator.validateOnUpdate(tillDto);
        Till till = this.getTill(id);
        till = this.tillMapper.zip(till, tillDto);
        till.setLastChangedBy(UserHelper.getCurrentUser());
        till = this.tillService.update(till);
        return this.tillMapper.mapToDto(till);
    }

    @PermissionRequired(moduleType = ModuleType.TELLER_MANAGEMENT, name = "OPEN_TILL", description = "Permission for open till")
    @PostMapping(value = "/{id}/open")
    public void open(@PathVariable Long id, @RequestParam(value = "tellerId") long tellerId) throws ResourceNotFoundException {
        this.tillValidator.validateOpenTillDto(tellerId);
        Till till = this.getTill(id);
        this.tillService.open(till, tellerId, UserHelper.getCurrentUser());
    }

    @PermissionRequired(moduleType = ModuleType.TELLER_MANAGEMENT, name = "CLOSE_TILL", description = "Permission for close till")
    @PostMapping(value = "/{id}/close")
    public void close(@PathVariable Long id,
                      @RequestParam(value = "tellerId") long tellerId) throws ResourceNotFoundException {
        Till till = this.getTill(id);
        this.tillService.close(till, tellerId, UserHelper.getCurrentUser());
    }

    @PermissionRequired(moduleType = ModuleType.TELLER_MANAGEMENT, name = "TRANSFER_TO_VAULT", description = "")
    @PostMapping(value = "/transfer/vault")
    public void transferToVault(@RequestBody TransferDto transferDto) {
        this.tillValidator.validateTransfer(transferDto);
        this.tillService.transferToVault(transferDto, UserHelper.getCurrentUser());
    }

    @PermissionRequired(moduleType = ModuleType.TELLER_MANAGEMENT, name = "TRANSFER_FROM_VAULT", description = "")
    @PostMapping(value = "/transfer/till")
    public void transferFromVault(@RequestBody TransferDto transferDto) {
        this.tillValidator.validateTransfer(transferDto);
        this.tillService.transferFromVault(transferDto, UserHelper.getCurrentUser());
    }

    @GetMapping(value = "/{id}/balance")
    public List<AccountBalanceDto> getBalances(@PathVariable long id,
                                               @RequestParam(value = "datetime")
                                               @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime dateTime) throws ResourceNotFoundException {
        Till till = this.getTill(id);
        return this.tillService.getBalance(till, dateTime);
    }

    @PermissionRequired(moduleType = ModuleType.TELLER_MANAGEMENT, name = "WITHDRAW", description = "")
    @PostMapping(value = "/{id}/operations/withdraw")
    public Long withdraw(@PathVariable long id, @RequestBody OperationDto dto) {
        this.tillValidator.validateOnWithdraw(dto);
        Till till = this.getTill(id);
        return this.tillService.withdraw(till, dto, UserHelper.getCurrentUser());
    }

    @PermissionRequired(moduleType = ModuleType.TELLER_MANAGEMENT, name = "DEPOSIT", description = "")
    @PostMapping(value = "/{id}/operations/deposit")
    public Long deposit(@PathVariable long id, @RequestBody OperationDto dto) {
        this.tillValidator.validateOperationCA(dto);
        Till till = this.getTill(id);
        return this.tillService.deposit(till, dto, UserHelper.getCurrentUser());
    }

    @RequestMapping(value = "/{id}/operations/printReceipt")
    public ResponseEntity printReceipt(@PathVariable long id, @RequestBody OperationDto dto) throws Exception {
        this.tillValidator.validateOperationCA(dto);
        Till till = this.getTill(id);
        return this.tillService.getReceipt(dto, till);
    }

    @GetMapping(value = "/{id}/operations")
    public Page<OperationDetailsDto> getOperations(@PathVariable long id,
                                                   @RequestParam(value = "currencyId", required = false) Long currencyId,
                                                   Pageable pageable) {
        Till till = this.getTill(id);
        this.tillValidator.validateOnGetOperation(till, currencyId);
        return this.tillService.getOperations(till, currencyId, pageable);
    }

    @GetMapping(value = "/lookup")
    public Page<TillDetailsDto> lookup(Pageable pageable, @RequestParam(value = "search", required = false) String search) {
        return this.tillService.lookup(pageable, search).map(this.tillMapper::mapToDto);
    }

    private Till getTill(Long id) throws ResourceNotFoundException {
        return this.tillService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Till not found (ID=%d).", id)));
    }
}
