package com.opencbs.loans.controllers;

import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.loans.domain.BatchRepaymentSplit;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.dto.LoanDto;
import com.opencbs.loans.mappers.LoanBatchScheduleMapper;
import com.opencbs.loans.services.LoanApplicationService;
import com.opencbs.loans.services.LoanWorker;
import com.opencbs.loans.services.repayment.LoanBatchRepaymentWorker;
import com.opencbs.loans.validators.LoanBatchRepaymentValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/loans/group-repayment")
@SuppressWarnings("unused")
public class LoanBatchRepaymentController {

    private final LoanBatchRepaymentWorker loanBatchRepaymentWorker;
    private final LoanBatchScheduleMapper loanBatchScheduleMapper;
    private final LoanApplicationService loanApplicationService;
    private final LoanWorker loanWorker;

    @Autowired
    public LoanBatchRepaymentController(LoanBatchRepaymentWorker loanBatchRepaymentWorker,
                                        LoanBatchScheduleMapper loanBatchScheduleMapper,
                                        LoanBatchRepaymentValidator loanBatchRepaymentValidator,
                                        LoanApplicationService loanApplicationService,
                                        LoanWorker loanWorker) {
        this.loanBatchRepaymentWorker = loanBatchRepaymentWorker;
        this.loanBatchScheduleMapper = loanBatchScheduleMapper;
        this.loanApplicationService = loanApplicationService;
        this.loanWorker = loanWorker;
    }

    @PermissionRequired(name = "MAKER_FOR_LOAN_REPAYMENT", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @PostMapping(value = "/repay")
    public LoanDto repay(@RequestBody List<BatchRepaymentSplit> repaymentSplit) throws Exception {
        List<BatchRepaymentSplit> batchRepaymentSplitList = this.loanBatchRepaymentWorker.batchRepayment(repaymentSplit, UserHelper.getCurrentUser());
        LoanDto groupLoan = this.loanWorker.getConsolidatedLoansByLoanApplication(this.loanApplicationService.getByLoanId(repaymentSplit
                .stream()
                .findAny()
                .get()
                .getLoanId()));
        return groupLoan;
    }

    @PostMapping(value = "{applicationId}/schedules")
    public ScheduleDto getSchedule(@RequestBody RepaymentSplit repaymentSplit,
                                   @PathVariable Long applicationId) throws Exception {
        LoanApplication loanApplication = this.loanApplicationService.getLoanApplicationById(applicationId);
        return this.loanBatchScheduleMapper.mapToScheduleDto(this.loanBatchRepaymentWorker.getBatchSchedule(loanApplication, repaymentSplit, UserHelper.getCurrentUser()));
    }
}
