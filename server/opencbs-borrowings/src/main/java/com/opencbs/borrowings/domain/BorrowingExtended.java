package com.opencbs.borrowings.domain;

import com.opencbs.borrowings.domain.schedule.BorrowingInstallment;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Data
public class BorrowingExtended {
    public BorrowingExtended(Borrowing borrowing) {
        this.borrowing = borrowing;
    }

    @Setter(AccessLevel.NONE)
    private Borrowing borrowing;

    private BigDecimal olb;
    private long lateDays;
    private BigDecimal outstandingInterest;
    private BigDecimal duePrincipal;
    private BigDecimal dueInterest;
    private Optional<LocalDateTime> lastAccrualDate;
    private BorrowingInstallment currentInstallment;
    private BorrowingInstallment currentInstallmentByLastAccrualDay;
    private List<BorrowingInstallment> installments;
    private List<BorrowingEvent> events;
}
