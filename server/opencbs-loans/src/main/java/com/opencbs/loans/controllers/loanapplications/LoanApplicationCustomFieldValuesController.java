package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.profiles.ProfileCustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.dto.loanapplications.LoanApplicationCustomFieldValuesDto;
import com.opencbs.loans.mappers.LoanApplicationMapper;
import com.opencbs.loans.services.LoanApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.script.ScriptException;
import java.util.List;

@RestController
@RequestMapping(value = "/api/loan-applications")
public class LoanApplicationCustomFieldValuesController {

    private final LoanApplicationService loanApplicationService;
    private final LoanApplicationMapper loanApplicationMapper;

    @Autowired
    public LoanApplicationCustomFieldValuesController(LoanApplicationService loanApplicationService,
                                                      LoanApplicationMapper loanApplicationMapper) {
        this.loanApplicationService = loanApplicationService;
        this.loanApplicationMapper = loanApplicationMapper;
    }

    @RequestMapping(value = "/custom-field-values/{loanId}")
    public List<ProfileCustomFieldSectionDto> getCustomFieldValuesByLoanId(@PathVariable long loanId) throws ResourceNotFoundException {
        LoanApplication loanApplication = this.loanApplicationService.getByLoanId(loanId);
        return this.loanApplicationMapper.getLoanApplicationCustomFieldValues(loanApplication);
    }

    @RequestMapping(value = "/{loanApplicationId}/custom-field-values", method = RequestMethod.GET)
    public List<ProfileCustomFieldSectionDto> getLoanApplicationCustomFieldValues(@PathVariable long loanApplicationId) throws ResourceNotFoundException {
        LoanApplication loanApplication = this.loanApplicationService.getLoanApplicationById(loanApplicationId);
        return this.loanApplicationMapper.getLoanApplicationCustomFieldValues(loanApplication);
    }

    @RequestMapping(value = "/{loanApplicationId}/custom-field-values", method = RequestMethod.POST)
    @PermissionRequired(name = "UPDATE_LOANS_APPLICATIONS", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public LoanApplicationCustomFieldValuesDto createLoanApplicationCustomFieldValues(@PathVariable long loanApplicationId,
                                                                                      @RequestBody LoanApplicationCustomFieldValuesDto dto) throws ResourceNotFoundException, ScriptException {
        LoanApplication loanApplication = this.loanApplicationService.getLoanApplicationById(loanApplicationId);
        this.loanApplicationMapper.setCustomFieldValuesToLoanApplication(loanApplication, dto, UserHelper.getCurrentUser());
        this.loanApplicationService.update(loanApplication);
        return dto;
    }

    @RequestMapping(value = "/{loanApplicationId}/custom-field-values", method = RequestMethod.PUT)
    @PermissionRequired(name = "UPDATE_LOANS_APPLICATIONS", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public LoanApplicationCustomFieldValuesDto updateLoanApplicationCustomFieldValues(@PathVariable long loanApplicationId,
                                                                                      @RequestBody LoanApplicationCustomFieldValuesDto dto) throws ResourceNotFoundException, ScriptException {
        LoanApplication loanApplication = this.loanApplicationService.getLoanApplicationById(loanApplicationId);
        this.loanApplicationMapper.updateLoanApplicationCustomFieldValues(loanApplication, dto, UserHelper.getCurrentUser());
        this.loanApplicationService.update(loanApplication);
        return dto;
    }
}
