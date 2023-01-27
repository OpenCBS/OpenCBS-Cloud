package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.services.OtherFeeService;
import com.opencbs.core.validators.OtherFeeValidation;
import com.opencbs.loans.services.LoanEventService;
import com.opencbs.loans.services.LoanOtherFeeService;
import org.springframework.util.Assert;

import java.math.BigDecimal;

@Validator
public class LoanOtherFeeValidation extends OtherFeeValidation {
    private final LoanEventService loanEventService;
    private final LoanValidator loanValidator;
    private final LoanOtherFeeService loanOtherFeeService;

    public LoanOtherFeeValidation(OtherFeeService otherFeeService,
                                  LoanEventService loanEventService,
                                  LoanValidator loanValidator,
                                  LoanOtherFeeService loanOtherFeeService) {
        super(otherFeeService);
        this.loanEventService = loanEventService;
        this.loanValidator = loanValidator;
        this.loanOtherFeeService = loanOtherFeeService;
    }

    public void validateOnRepay(Long loanId, Long otherFeeId, BigDecimal repayment) {
        this.loanValidator.validateClosedLoan(loanId);
        Assert.notNull(otherFeeId, "Other fee id is required");
        boolean isCharged = this.loanEventService.findAllByLoanId(loanId)
                .stream()
                .anyMatch(x -> x.getEventType().equals(EventType.OTHER_FEE_CHARGE) && !x.getDeleted());
        BigDecimal balance = this.loanOtherFeeService.getOtherFeeLoanBalance(loanId, otherFeeId);
        Assert.isTrue(isCharged, "There is no any charged events");
        Assert.isTrue(balance.compareTo(repayment) >= 0, "Amount should be less than " + balance);
    }
}
