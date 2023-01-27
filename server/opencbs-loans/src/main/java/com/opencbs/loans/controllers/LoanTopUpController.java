package com.opencbs.loans.controllers;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.dto.LoanTopUpDto;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.services.LoanTopUpService;
import com.opencbs.loans.validators.LoanTopUpValidator;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping(value = "/api/loans")
public class LoanTopUpController extends BaseController {

    private final LoanService loanService;
    private final LoanTopUpService loanTopUpService;
    private final LoanTopUpValidator loanTopUpValidator;

    public LoanTopUpController(LoanService loanService,
                               LoanTopUpService loanTopUpService,
                               LoanTopUpValidator loanTopUpValidator) {
        this.loanService = loanService;
        this.loanTopUpService = loanTopUpService;
        this.loanTopUpValidator = loanTopUpValidator;
    }

    @PermissionRequired(name = "TOP_UP", moduleType = ModuleType.LOANS, description = "")
    @RequestMapping(value = "/{loanId}/top-up", method = POST)
    public void topUp(@PathVariable long loanId, @RequestBody LoanTopUpDto dto) throws Exception {
        Loan loan = this.loanService.findOne(loanId)
                .orElseThrow(() -> new RuntimeException(String.format("Loan with id - %s not found", loanId)));
        //add validator for check already done day closure for this loan
        
        this.loanTopUpValidator.validate(dto, loan);

        this.loanTopUpService.topUp(loan, dto, UserHelper.getCurrentUser());
    }
}
