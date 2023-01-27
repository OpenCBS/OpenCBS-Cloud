package com.opencbs.loans.services.repayment;

import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.dto.RepaymentResult;

import java.util.List;


public interface LoanRepaymentService<T extends RepaymentSplit> {

    T split(Long loanId, T repaymentSplit);

    List<LoanInstallment> preview(Loan loan, T repaymentSplit);

    RepaymentResult repay(Loan loan, T repaymentSplit);

    boolean isNeedClose();
}
