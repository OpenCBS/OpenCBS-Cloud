package com.opencbs.borrowings.validators;

import com.opencbs.borrowings.domain.BorrowingEvent;
import com.opencbs.borrowings.domain.BorrowingProduct;
import com.opencbs.borrowings.dto.BorrowingDto;
import com.opencbs.borrowings.services.BorrowingEventService;
import com.opencbs.borrowings.services.BorrowingProductService;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Validator
@RequiredArgsConstructor
public class BorrowingValidator {

    private final BorrowingProductService borrowingProductService;
    private final ProfileService profileService;
    private final BorrowingEventService borrowingEventService;
    private final AccountService accountService;


    public void validate(BorrowingDto dto) throws ResourceNotFoundException {
        Assert.notNull(dto.getAmount(), "Amount is required.");
        Assert.notNull(dto.getDisbursementDate(), "Disbursement date is required.");
        Assert.isTrue(!DateHelper.isDayOff(dto.getDisbursementDate()), "Disbursement date should be a working date");
        Assert.notNull(dto.getPreferredRepaymentDate(), "Preferred repayment date is required.");
        Assert.isTrue(!DateHelper.isDayOff(dto.getPreferredRepaymentDate()), "Preferred repayment date should be a working date");

        Assert.notNull(dto.getBorrowingProductId(), "Borrowing product is required.");
        BorrowingProduct borrowingProduct = this.borrowingProductService.findOne(dto.getBorrowingProductId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Borrowing product is not found (ID=%d).", dto.getBorrowingProductId())));

        Assert.notNull(dto.getScheduleType(), "Schedule type is required.");
        Assert.isTrue(dto.getScheduleType() == borrowingProduct.getScheduleType(), "The schedule type should match with borrowing product's schedule type");
        Assert.isTrue(
                this.between(dto.getAmount(), borrowingProduct.getAmountMin(), borrowingProduct.getAmountMax()),
                String.format("Amount must be within the range %f and %f.",
                        borrowingProduct.getAmountMin(), borrowingProduct.getAmountMax()));

        Assert.notNull(dto.getInterestRate(), "Interest rate is required.");
        Assert.isTrue(
                this.between(dto.getInterestRate(), borrowingProduct.getInterestRateMin(), borrowingProduct.getInterestRateMax()),
                String.format("Interest rate must be within the range %f and %f.",
                        borrowingProduct.getInterestRateMin(), borrowingProduct.getInterestRateMax()));

        Assert.isTrue(
                dto.getMaturity() >= borrowingProduct.getMaturityMin()
                        && dto.getMaturity() <= borrowingProduct.getMaturityMax(),
                String.format("Maturity must be within the range %d and %d.",
                        borrowingProduct.getMaturityMin(), borrowingProduct.getMaturityMax()));

        this.profileService.findOne(dto.getProfileId()).orElseThrow(() -> new ResourceNotFoundException(
                String.format("Profile is not found (ID=%d).", dto.getProfileId())));

        Assert.isTrue(
                dto.getGracePeriod() >= borrowingProduct.getGracePeriodMin()
                        && dto.getGracePeriod() <= borrowingProduct.getGracePeriodMax(),
                String.format("Grace period must be within the range %d and %d.",
                        borrowingProduct.getGracePeriodMin(), borrowingProduct.getGracePeriodMax()));
        Assert.isTrue(dto.getGracePeriod() < dto.getMaturity(),
                "Grace period must be less than maturity");

        Assert.notNull(dto.getCorrespondenceAccountId(), "Correspondence account is required.");
        this.accountService.findOne(dto.getCorrespondenceAccountId()).orElseThrow(() -> new ResourceNotFoundException(
                String.format("Correspondence account is not found (ID=%d).", dto.getCorrespondenceAccountId())));
    }

    private boolean between(BigDecimal amount, BigDecimal min, BigDecimal max) {
        return min.doubleValue() <= amount.doubleValue() && amount.doubleValue() <= max.doubleValue();
    }

    public void validateClosedBorrowing(Long borrowingId) {
        Optional<BorrowingEvent> closedEvent = this.borrowingEventService.findAllByBorrowingId(borrowingId)
                .stream()
                .filter(x -> x.getEventType().equals(EventType.CLOSED))
                .findFirst();
        closedEvent.ifPresent(borrowingEventEvent -> Assert.isTrue(borrowingEventEvent.getEffectiveAt()
                .compareTo(LocalDateTime.now()) <= 0, "Borrowing is closed."));
    }
}
