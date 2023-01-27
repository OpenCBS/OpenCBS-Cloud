package com.opencbs.loans.services.repayment;

import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.schedule.BatchRepay;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.ActualizeHelper;
import com.opencbs.loans.domain.BatchRepaymentSplit;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.validators.LoanRepayValidator;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class LoanBatchRepaymentWorker {

    private final LoanService loanService;
    private final LoanRepayValidator loanRepayValidator;
    protected final LoanRepaymentServiceFactory loanRepaymentServiceFactory;

    public LoanBatchRepaymentWorker(LoanService loanService,
                                    LoanRepayValidator loanRepayValidator,
                                    LoanRepaymentServiceFactory loanRepaymentServiceFactory) {
        this.loanService = loanService;
        this.loanRepayValidator = loanRepayValidator;
        this.loanRepaymentServiceFactory = loanRepaymentServiceFactory;
    }

    public List<BatchRepay> getBatchSchedule(LoanApplication loanApplication, RepaymentSplit repaymentSplit, User currentUser) {
        List<Loan> loans = this.loanService.findAllByLoanApplication(loanApplication);
        List<BatchRepay> batchRepays = new ArrayList<>();
        for (Loan loan : loans) {
            this.loanRepayValidator.validate(repaymentSplit, loan.getId(), currentUser);

            LoanRepaymentService<RepaymentSplit> loanRepaymentService =
                    this.loanRepaymentServiceFactory.getLoanRepaymentService(repaymentSplit.getRepaymentType());
            RepaymentSplit split = loanRepaymentService.split(loan.getId(), repaymentSplit);

            LoanInstallment loanInstallment = this.loanService.findSchedule(loan.getId())
                    .stream()
                    .filter((x) -> x.isPaid() == false && x.isPartiallyPaid() == false && x.getDeleted() == false)
                    .findFirst()
                    .get();
            BatchRepay batchRepay = new BatchRepay();

            batchRepay.setName(loan.getProfile().getName());
            batchRepay.setPrincipal(loanInstallment.getPrincipal());
            batchRepay.setInterest(loanInstallment.getInterest());
            batchRepay.setAccruedInterest(loanInstallment.getAccruedInterest());
            batchRepay.setPenalty(loanInstallment.getPenalty());
            batchRepay.setPaidPrincipal(split.getPrincipal());
            batchRepay.setPaidInterest(split.getInterest());
            batchRepay.setPaidPenalty(split.getPenalty());
            batchRepay.setTotal(split.getTotal());
            batchRepay.setOlb(loanInstallment.getOlb());

            batchRepays.add(batchRepay);
        }
        return batchRepays;
    }

    @Transactional
    public List<BatchRepaymentSplit> batchRepayment(List<BatchRepaymentSplit> batchRepaymentSplits, User currentUser) throws Exception {
        List<BatchRepaymentSplit> result = new ArrayList<>();
        for (BatchRepaymentSplit repaymentSplit : batchRepaymentSplits) {
            this.loanRepayValidator.validate(repaymentSplit, repaymentSplit.getLoanId(), currentUser);
            ActualizeHelper.isActualized(repaymentSplit.getLoanId(), ModuleType.LOANS, repaymentSplit.getTimestamp().toLocalDate());
            Loan loan = this.loanService.findOne(repaymentSplit.getLoanId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan is not found (ID=%d).", repaymentSplit.getLoanId())));
            LoanRepaymentService loanRepaymentService =
                    this.loanRepaymentServiceFactory.getLoanRepaymentService(repaymentSplit.getRepaymentType());
            loanRepaymentService.repay(loan, repaymentSplit);
            result.add(repaymentSplit);
        }
        return result;
    }
}
