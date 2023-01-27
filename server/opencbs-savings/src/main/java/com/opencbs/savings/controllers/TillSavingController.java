package com.opencbs.savings.controllers;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.savings.dto.OperationSavingDto;
import com.opencbs.savings.dto.SavingWithAccountDto;
import com.opencbs.savings.services.SavingService;
import com.opencbs.savings.validators.TillSavingValidator;
import com.opencbs.savings.worker.TillWorker;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/tills")
public class TillSavingController extends BaseController {

    private final TillSavingValidator tillSavingValidator;
    private final SavingService savingService;
    private final TillWorker tillWorker;

    @Autowired
    public TillSavingController(TillSavingValidator tillSavingValidator,
                                SavingService savingService,
                                @NonNull TillWorker tillWorker) {
        this.tillSavingValidator = tillSavingValidator;
        this.savingService = savingService;
        this.tillWorker = tillWorker;
    }

    @GetMapping(value = "/savings-with-account")
    public Page<SavingWithAccountDto> getAllWithCurrentAccount(@RequestParam(value = "search", required = false) String search,
                                                               Pageable pageable) {
        return this.savingService.getAllWithAccount(search, pageable);
    }

    @PermissionRequired(moduleType = ModuleType.TELLER_MANAGEMENT, name = "DEPOSIT-SAVING", description = "")
    @PostMapping(value = "/{id}/operations/deposit-saving")
    public Long deposit(@PathVariable long id, @RequestBody OperationSavingDto dto) {
        this.tillSavingValidator.validateOperationSaving(dto);
        return this.tillWorker.depositToSaving(id, dto);
    }

    @PermissionRequired(moduleType = ModuleType.TELLER_MANAGEMENT, name = "WITHDRAW-SAVING", description = "")
    @PostMapping(value = "/{id}/operations/withdraw-saving")
    public Long withdraw(@PathVariable long id, @RequestBody OperationSavingDto dto) {
        return this.tillWorker.withdrawFromSaving(id, dto, UserHelper.getCurrentUser());
    }
}
