package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.services.PayeeEventService;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.LoanApplicationPayees;
import com.opencbs.loans.domain.enums.LoanApplicationPayeeStatus;
import com.opencbs.loans.dto.loanapplications.LoanApplicationPayeesDto;
import org.springframework.util.Assert;

import java.time.LocalDate;

@Validator
public class LoanApplicationPayeesValidator {

    private final PayeeEventService payeeEventService;

    public LoanApplicationPayeesValidator(PayeeEventService payeeEventService) {
        this.payeeEventService = payeeEventService;
    }

    public void validate(LoanApplicationPayeesDto dto, LoanApplication loanApplication) {
        LocalDate loanApplicationDisbursementDate = loanApplication.getDisbursementDate();
        LocalDate loanApplicationPayeeDisbursementDate = dto.getDisbursementDate();
        Assert.isTrue(loanApplicationPayeeDisbursementDate.compareTo(loanApplicationDisbursementDate) >= 0, "Date should be later than loan disbursement date.");
    }

    public void refundValidate(LoanApplicationPayees payee) {
        Assert.isTrue(payee.getStatus().equals(LoanApplicationPayeeStatus.DISBURSED), "Payee must be disbursed.");
    }

    public void disburseValidate(LoanApplicationPayees payee, String number) {
        Assert.isTrue(!payee.getStatus().equals(LoanApplicationPayeeStatus.DISBURSED), "Payee is already disbursed.");
        Assert.isTrue(!payee.getStatus().equals(LoanApplicationPayeeStatus.DELETED), "Payee is deleted.");
        Assert.isTrue(!this.payeeEventService.findByCheck(number), "Cheque number must be unique.");
    }
}

