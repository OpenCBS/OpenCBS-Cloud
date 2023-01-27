package com.opencbs.borrowings.dayclose;

import com.opencbs.borrowings.domain.BorrowingEvent;
import com.opencbs.borrowings.domain.BorrowingEventInterestAccrual;
import com.opencbs.borrowings.domain.BorrowingInterestAccrual;
import com.opencbs.borrowings.domain.schedule.BorrowingInstallmentInterestAccrual;
import com.opencbs.borrowings.repositories.BorrowingInterestAccrualRepository;
import com.opencbs.borrowings.repositories.implementations.BorrowingGroupKeyRepository;
import com.opencbs.borrowings.services.BorrowingAccountingService;
import com.opencbs.borrowings.services.BorrowingEventInterestAccrualService;
import com.opencbs.borrowings.services.BorrowingEventService;
import com.opencbs.borrowings.services.BorrowingInstallmentInterestAccrualService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.DateHelper;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowingInterestAccrualProcessor implements BorrowingDayClosureProcessor {

    private static final int DEFAULT_PRECISION = 2;
    private static final RoundingMode DEFAULT_ROUND_MODE = RoundingMode.HALF_UP;

    private final BorrowingEventService borrowingEventService;
    private final BorrowingGroupKeyRepository borrowingGroupKeyRepository;
    private final BorrowingAccountingService borrowingAccountingService;
    private final BorrowingInterestAccrualRepository borrowingRepository;
    private final BorrowingEventInterestAccrualService borrowingEventInterestAccrualService;
    private final BorrowingInstallmentInterestAccrualService interestAccrualService;


    @Override
    public void processContract(@NonNull Long borrowingId, @NonNull LocalDate closureDate, @NonNull User user) {
        BorrowingInterestAccrual borrowing = borrowingRepository.findOne(borrowingId);
        processInterestAccrual(borrowing, closureDate.atTime(getProcessType().getOperationTime()), user);
    }

    @Override
    public ProcessType getProcessType() {
        return ProcessType.BORROWING_ACCRUAL;
    }

    @Override
    public String getIdentityString() {
        return "borrowing.interest-processInterestAccrual";
    }

    private void processInterestAccrual(@NonNull BorrowingInterestAccrual borrowing, @NonNull LocalDateTime dateTime, @NonNull User user) {
        BorrowingInstallmentInterestAccrual currentInstallment = interestAccrualService.getCurrentInstallment(borrowing.getId(), dateTime);

        int daysCount = DateHelper.getDaysCountInYear(currentInstallment.getEffectiveAt().getYear());
        BigDecimal dailyInterest = currentInstallment.getOlb()
                .multiply(borrowing.getInterestRate()
                .divide(BigDecimal.valueOf(100), DEFAULT_PRECISION, RoundingMode.DOWN))
                .divide(BigDecimal.valueOf(daysCount), DEFAULT_PRECISION, DEFAULT_ROUND_MODE);

        if (dateTime.toLocalDate().isEqual(currentInstallment.getLastAccrualDate())) {
            BigDecimal currentInstallmentAccruedInterest = getCurrentInstallmentAccruedInterest(borrowing, currentInstallment);
            dailyInterest = currentInstallment.getInterest().subtract(currentInstallmentAccruedInterest);
        }

        BorrowingEvent borrowingEvent = createBorrowingEvent(borrowing, currentInstallment.getNumber(), dailyInterest, dateTime, user);
        borrowingAccountingService.createInterestAccrualAccountingEntry(borrowingEvent);
    }

    private BorrowingEvent createBorrowingEvent(@NonNull BorrowingInterestAccrual borrowing,
                                                int installmentId,
                                                @NonNull BigDecimal interest,
                                                @NonNull LocalDateTime dateTime,
                                                @NonNull User user) {
        LocalDateTime eventDateTime = DateHelper.equal(borrowing.getDisbursementDate().toLocalDate(), dateTime.toLocalDate())
                ? borrowing.getDisbursementDate().plusMinutes(1)
                : dateTime;

        BorrowingEvent event = new BorrowingEvent();
        event.setAmount(interest);
        event.setEventType(EventType.ACCRUAL_OF_INTEREST);
        event.setBorrowingId(borrowing.getId());
        event.setComment("Interest processInterestAccrual for Borrowing");
        event.setEffectiveAt(eventDateTime);
        event.setCreatedAt(LocalDateTime.now());
        event.setGroupKey(borrowingGroupKeyRepository.getNextEventGroupKey());
        event.setDeleted(false);
        event.setSystem(true);
        event.setInstallmentNumber(installmentId);
        event.setCreatedById(user.getId());

        return borrowingEventService.save(event);
    }

    private BigDecimal getCurrentInstallmentAccruedInterest(@NonNull BorrowingInterestAccrual borrowing, BorrowingInstallmentInterestAccrual currentInstallment) {
        List<BorrowingEventInterestAccrual> events = borrowingEventInterestAccrualService.getBorrowingEvents(borrowing.getId(), EventType.ACCRUAL_OF_INTEREST);
        return events
                .stream()
                .filter(x -> x.getInstallmentNumber().equals(currentInstallment.getNumber()))
                .map(BorrowingEventInterestAccrual::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
