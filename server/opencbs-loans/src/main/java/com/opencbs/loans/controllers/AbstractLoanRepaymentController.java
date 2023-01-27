package com.opencbs.loans.controllers;

import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.ActualizeHelper;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.dto.RequestDto;
import com.opencbs.core.request.serivce.MakerCheckerWorker;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.mappers.LoanScheduleMapper;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.services.repayment.LoanRepaymentService;
import com.opencbs.loans.services.repayment.LoanRepaymentServiceFactory;
import com.opencbs.loans.validators.LoanRepayValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@RequestMapping(value = "/api/loans/{loanId}/repayment")
public abstract class AbstractLoanRepaymentController<T extends RepaymentSplit> {

    protected final LoanRepaymentServiceFactory loanRepaymentServiceFactory;
    protected final LoanService loanService;
    protected final LoanRepayValidator loanRepayValidator;
    private final LoanScheduleMapper loanScheduleMapper;
    private final MakerCheckerWorker makerCheckerWorker;


    @PostMapping(value = "/split")
    public T split(@PathVariable Long loanId, @RequestBody T repaymentSplit) throws ResourceNotFoundException {
        LoanRepaymentService<T> loanRepaymentService = loanRepaymentServiceFactory.getLoanRepaymentService(repaymentSplit.getRepaymentType());
        return loanRepaymentService.split(loanId, repaymentSplit);
    }

    @PostMapping(value = "/preview")
    public ScheduleDto preview(@PathVariable Long loanId, @RequestBody T repaymentSplit) {
        loanRepayValidator.validate(repaymentSplit, loanId, UserHelper.getCurrentUser());
        Loan loan = loanService.getLoanById(loanId);
        LoanRepaymentService loanRepaymentService = loanRepaymentServiceFactory.getLoanRepaymentService(repaymentSplit.getRepaymentType());
        return loanScheduleMapper.mapToScheduleDto(loanRepaymentService.preview(loan, repaymentSplit), DateHelper.getLocalDateNow());
    }

    @PostMapping(value = "/repay")
    @PermissionRequired(name = "MAKER_FOR_LOAN_REPAYMENT", moduleType = ModuleType.MAKER_CHECKER, description = "")
    public RequestDto repay(@PathVariable Long loanId, @RequestBody T repaymentSplit) throws Exception {
        loanRepayValidator.validate(repaymentSplit, loanId, UserHelper.getCurrentUser());
        ActualizeHelper.isActualized(loanId, ModuleType.LOANS, repaymentSplit.getTimestamp().toLocalDate());
        repaymentSplit.setId(loanId);
        Request request = makerCheckerWorker.create(RequestType.LOAN_REPAYMENT, repaymentSplit);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());

        return detailsDto;
    }
}
