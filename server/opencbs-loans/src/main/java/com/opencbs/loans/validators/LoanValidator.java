package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.dto.WriteOffDto;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanInfo;
import com.opencbs.loans.domain.enums.LoanStatus;
import com.opencbs.loans.services.LoanEventService;
import com.opencbs.loans.services.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Validator
@RequiredArgsConstructor
public class LoanValidator {

    private final LoanEventService loanEventService;
    private final LoanService loanService;

    public void writeOffValidation(Loan loan, LocalDateTime loanEventEffectiveDate, WriteOffDto dto) {
        this.validateClosedLoan(loan.getId());
        LoanInfo loanInfo = this.loanService.getLoanInfo(loan.getId(), dto.getDate().toLocalDate());

        Assert.isTrue(loan.getStatus().equals(LoanStatus.ACTIVE), "Loan is not active.");
        Assert.isTrue(DateHelper.greaterOrEqual(dto.getDate(), loanEventEffectiveDate), "You can not set date earlier than last event`s date.");

        Assert.isTrue(dto.getPrincipal().compareTo(loanInfo.getOlb()) <= 0, "Written off principal cannot be greater than olb");
        Assert.isTrue(dto.getInterest().compareTo(loanInfo.getInterest()) <= 0, "Written off interest cannot be greater than accrued interest");
        Assert.isTrue(dto.getPenalty().compareTo(loanInfo.getPenalty()) <= 0, "Written off penalty cannot be greater than accrued penalty");

        Assert.isTrue(dto.getPrincipal().compareTo(BigDecimal.ZERO) >= 0, "Written off principal must be equal or greater than 0");
        Assert.isTrue(dto.getInterest().compareTo(BigDecimal.ZERO) >= 0, "Written off interest must be equal or greater than 0");
        Assert.isTrue(dto.getPenalty().compareTo(BigDecimal.ZERO) >= 0, "Written off penalty must be equal or greater than 0");
    }

    public void validateClosedLoan(Long loanId) {
        Optional<LoanEvent> closedEvent = this.loanEventService.findAllByLoanId(loanId)
                .stream()
                .filter(x -> x.getEventType().equals(EventType.CLOSED) && !x.getDeleted()) //TODO rewrite LoanEvent.class with @WHERE clause
                .findFirst();
        closedEvent.ifPresent(loanEvent -> Assert.isTrue(loanEvent.getEffectiveAt().isAfter(DateHelper.getLocalDateTimeNow()), "Loan is closed."));
    }
}
