package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanInfo;
import com.opencbs.loans.services.LoanEventService;
import com.opencbs.loans.services.LoanPenaltyEventService;
import com.opencbs.loans.services.LoanService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.util.Assert;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;

@Validator
@RequiredArgsConstructor
public class LoanRepayValidator {

    private final LoanEventService loanEventService;
    private final LoanValidator loanValidator;
    private final LoanService loanService;
    private final LoanPenaltyEventService loanPenaltyEventService;


    public void validate(@NonNull RepaymentSplit repaymentSplit, @NonNull Long loanId, @NonNull User user) {
        loanValidator.validateClosedLoan(loanId);
        LocalDate repaymentDate  = repaymentSplit.getTimestamp().toLocalDate();
        LocalDateTime lastEventDate = loanEventService.findAllByLoanId(loanId)
                .stream()
                .filter(x -> !x.getDeleted())
                .max(Comparator.comparing(LoanEvent::getEffectiveAt))
                .map(LoanEvent::getEffectiveAt)
                .orElse(repaymentSplit.getTimestamp().minusHours(1));

        if (repaymentDate.isBefore(DateHelper.getLocalDateNow())) {
            Assert.isTrue(user.hasPermission("PAST_REPAYMENTS"), "You do not have the permission to make past repayments.");
        }

        final LoanInfo loanInfo = this.loanService.getLoanInfo(loanId, repaymentDate);
        Assert.isTrue(loanInfo.getOlb().compareTo(repaymentSplit.getPrincipal())>=0, "Principal can't be more OLB" );
        Assert.isTrue(loanInfo.getInterest().compareTo(repaymentSplit.getInterest())>=0,
                "Amount of Interest can't be more not payment interest" );
        Assert.isTrue(loanPenaltyEventService.getPenaltyAmount(loanId, repaymentDate).compareTo(repaymentSplit.getPenalty())>=0,
                "Amount of penalty can't be more accrual penalty" );
    }
}
