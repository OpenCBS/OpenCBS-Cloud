package com.opencbs.loans.controllers;

import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.request.serivce.MakerCheckerWorker;
import com.opencbs.loans.annotations.repayment.CustomLoanRepaymentRestController;
import com.opencbs.loans.mappers.LoanScheduleMapper;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.services.repayment.LoanRepaymentServiceFactory;
import com.opencbs.loans.validators.LoanRepayValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnMissingBean(annotation = CustomLoanRepaymentRestController.class)
public class LoanRepaymentController extends AbstractLoanRepaymentController<RepaymentSplit> {

    @Autowired
    public LoanRepaymentController(LoanService loanService,
                                   LoanRepaymentServiceFactory loanRepaymentServiceFactory,
                                   LoanScheduleMapper loanScheduleMapper,
                                   LoanRepayValidator loanRepayValidator,
                                   MakerCheckerWorker makerCheckerWorker) {

        super(loanRepaymentServiceFactory,
                loanService,
                loanRepayValidator,
                loanScheduleMapper,
                makerCheckerWorker);
    }
}
