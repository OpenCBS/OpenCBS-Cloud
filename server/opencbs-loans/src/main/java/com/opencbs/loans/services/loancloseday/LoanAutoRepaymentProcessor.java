package com.opencbs.loans.services.loancloseday;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.loans.annotations.CustomLoanAutoRepayment;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@ConditionalOnMissingBean(annotation = CustomLoanAutoRepayment.class)
public class LoanAutoRepaymentProcessor implements LoanDayClosureProcessor {

    @Override
    public void processContract(Long contractId, LocalDate closureDate, User user) {

    }

    @Override
    public ProcessType getProcessType() {
        return ProcessType.LOAN_AUTO_REPAYMENT;
    }

    @Override
    public String getIdentityString() {
        return "loan.auto-repayment";
    }
}
