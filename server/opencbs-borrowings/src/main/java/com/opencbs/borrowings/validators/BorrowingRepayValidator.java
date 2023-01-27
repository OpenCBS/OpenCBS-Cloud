package com.opencbs.borrowings.validators;

import com.opencbs.borrowings.domain.BorrowingEvent;
import com.opencbs.borrowings.services.BorrowingEventService;
import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.enums.EventType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.Comparator;

@Validator
public class BorrowingRepayValidator {

    private final BorrowingEventService borrowingEventService;
    private final BorrowingValidator borrowingValidator;

    @Autowired
    public BorrowingRepayValidator(BorrowingEventService borrowingEventService,
                                   BorrowingValidator borrowingValidator) {
        this.borrowingEventService = borrowingEventService;
        this.borrowingValidator = borrowingValidator;
    }

    public void validate(RepaymentSplit repaymentSplit, Long borrowingId) {
        this.borrowingValidator.validateClosedBorrowing(borrowingId);
        LocalDateTime lastRepaymentDate = this.borrowingEventService.findAllByBorrowingId(borrowingId)
                .stream()
                .sorted(Comparator.comparing(BorrowingEvent::getEffectiveAt))
                .filter(x -> x.getEventType().equals(EventType.REPAYMENT_OF_PENALTY) ||
                        x.getEventType().equals(EventType.REPAYMENT_OF_INTEREST) ||
                        x.getEventType().equals(EventType.REPAYMENT_OF_PRINCIPAL))
                .map(BorrowingEvent::getEffectiveAt)
                .findFirst()
                .orElse(repaymentSplit.getTimestamp().minusHours(1));
        Assert.isTrue(repaymentSplit.getTimestamp().plusSeconds(1).isAfter(lastRepaymentDate), "The date cannot be less than the last repayment date.");
    }
}
