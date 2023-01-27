package com.opencbs.loans.controllers;

import com.opencbs.core.controllers.OtherFeeController;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.OtherFeeDto;
import com.opencbs.core.dto.OtherFeeParamsDto;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.OtherFeeMapper;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.core.services.OtherFeeService;
import com.opencbs.core.validators.OtherFeeValidation;
import com.opencbs.loans.annotations.CustomLoanOtherFeeController;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.dto.LoanEventDto;
import com.opencbs.loans.mappers.LoanEventMapper;
import com.opencbs.loans.services.LoanOtherFeeService;
import com.opencbs.loans.validators.LoanOtherFeeValidation;
import com.opencbs.loans.validators.LoanValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;


@RestController
@ConditionalOnMissingBean(annotation = CustomLoanOtherFeeController.class)
public class LoanOtherFeeController extends OtherFeeController {

    private final LoanOtherFeeService loanOtherFeeService;
    private final LoanEventMapper loanEventMapper;
    private final LoanOtherFeeValidation loanOtherFeeValidation;
    private final LoanValidator loanValidator;

    @Autowired
    public LoanOtherFeeController(OtherFeeService otherFeeService,
                                  OtherFeeValidation otherFeeValidation,
                                  OtherFeeMapper otherFeeMapper,
                                  LoanOtherFeeService loanOtherFeeService,
                                  LoanEventMapper loanEventMapper,
                                  LoanOtherFeeValidation loanOtherFeeValidation,
                                  LoanValidator loanValidator) {
        super(otherFeeService,  otherFeeValidation,  otherFeeMapper);
        this.loanOtherFeeService = loanOtherFeeService;
        this.loanEventMapper = loanEventMapper;
        this.loanOtherFeeValidation = loanOtherFeeValidation;
        this.loanValidator = loanValidator;
    }

    @RequestMapping(value = "/{loanId}/other-fees", method = RequestMethod.GET)
    public Page<OtherFeeDto> getAll(@PathVariable long loanId, Pageable pageable) {
        return this.loanOtherFeeService.getAll(pageable, loanId);
    }

    @PermissionRequired(name = "OTHER_FEE_CHARGE", moduleType = ModuleType.LOANS, description = "")
    @RequestMapping(value = "/{otherFeeId}/{loanId}/charge", method = RequestMethod.POST)
    public LoanEventDto charge(@PathVariable Long otherFeeId,
                               @PathVariable Long loanId,
                               @RequestBody OtherFeeParamsDto dto) {
        this.loanValidator.validateClosedLoan(loanId);
        LoanEvent event = this.loanOtherFeeService.charge(loanId, otherFeeId, dto, UserHelper.getCurrentUser());
        return this.loanEventMapper.mapToDto(event);
    }

    @PermissionRequired(name = "OTHER_FEE_REPAY", moduleType = ModuleType.LOANS, description = "")
    @RequestMapping(value = "/{otherFeeId}/{loanId}/repay", method = RequestMethod.POST)
    public LoanEventDto repay(@PathVariable Long otherFeeId,
                              @PathVariable Long loanId,
                              @RequestBody OtherFeeParamsDto dto) {
        this.loanValidator.validateClosedLoan(loanId);
        LoanEvent event = this.loanOtherFeeService.repay(loanId, otherFeeId, dto, UserHelper.getCurrentUser());
        return this.loanEventMapper.mapToDto(event);
    }

    @PermissionRequired(name = "OTHER_FEE_WAIVE_OFF", moduleType = ModuleType.LOANS, description = "")
    @RequestMapping(value = "/{otherFeeId}/{loanId}/waive-off", method = RequestMethod.POST)
    public LoanEventDto wayOff(@PathVariable Long otherFeeId,
                               @PathVariable Long loanId,
                               @RequestBody OtherFeeParamsDto dto) {
        this.loanOtherFeeValidation.validateOnRepay(loanId, otherFeeId, dto.getAmount());
        LoanEvent event = this.loanOtherFeeService.waiveOff(loanId, otherFeeId, dto, UserHelper.getCurrentUser());
        return this.loanEventMapper.mapToDto(event);
    }
}
