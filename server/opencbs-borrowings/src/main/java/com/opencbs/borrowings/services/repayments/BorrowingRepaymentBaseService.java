package com.opencbs.borrowings.services.repayments;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.BorrowingEvent;
import com.opencbs.borrowings.domain.schedule.BorrowingInstallment;
import com.opencbs.borrowings.services.BorrowingAccountingService;
import com.opencbs.borrowings.services.BorrowingService;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.helpers.DateHelper;
import lombok.Data;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

abstract class BorrowingRepaymentBaseService {

    private final BorrowingRepaymentStoreService borrowingRepaymentStoreService;
    private final BorrowingAccountingService borrowingAccountingService;
    protected final BorrowingService borrowingService;

    BorrowingRepaymentBaseService(
            BorrowingRepaymentStoreService borrowingRepaymentStoreService,
            BorrowingAccountingService borrowingAccountingService,
            BorrowingService borrowingService) {
        this.borrowingRepaymentStoreService = borrowingRepaymentStoreService;
        this.borrowingAccountingService = borrowingAccountingService;
        this.borrowingService = borrowingService;
    }

    public List<BorrowingInstallment> preview(Borrowing borrowing, RepaymentSplit repaymentSplit, User currentUser) throws Exception {
        RepaymentResult result = this.repayImpl(borrowing, repaymentSplit, currentUser, false);
        return result.getInstallments();
    }

    @Transactional
    public void repay(Borrowing borrowing, RepaymentSplit repaymentSplit, User currentUser) throws Exception {
        RepaymentResult result = this.repayImpl(borrowing, repaymentSplit, currentUser, true);
        result.setBorrowing(borrowing);
        result.setCurrentUser(currentUser);
        result.setTimestamp(repaymentSplit.getTimestamp());
        this.borrowingRepaymentStoreService.save(result);
    }

    protected abstract RepaymentResult repayImpl(Borrowing borrowing, RepaymentSplit repaymentSplit, User currentUser, boolean persist) throws Exception;

    @Data
    class RepaymentResult {
        private List<BorrowingInstallment> installments;
        private Set<Integer> affectedNumbers;
        private List<BorrowingEvent> events;
        private Borrowing borrowing;
        private LocalDateTime timestamp;
        private User currentUser;
        private List<AccountingEntry> accountingEntries;

        RepaymentResult(
                List<BorrowingInstallment> installments,
                Set<Integer> affectedNumbers,
                List<BorrowingEvent> events,
                List<AccountingEntry> accountingEntries
        ) {
            this.installments = installments;
            this.affectedNumbers = affectedNumbers;
            this.events = events;
            this.accountingEntries = accountingEntries;
        }
    }

    BorrowingEvent getRepaymentOfInterestEvent(Integer installmentNumber, BigDecimal amount) {
        BorrowingEvent event = new BorrowingEvent();
        event.setEventType(EventType.REPAYMENT_OF_INTEREST);
        event.setInstallmentNumber(installmentNumber);
        event.setAmount(amount);
        event.setCreatedAt(DateHelper.getLocalDateTimeNow());
        return event;
    }

    BorrowingEvent getRepaymentOfPrincipalEvent(Integer installmentNumber, BigDecimal amount) {
        BorrowingEvent event = new BorrowingEvent();
        event.setEventType(EventType.REPAYMENT_OF_PRINCIPAL);
        event.setInstallmentNumber(installmentNumber);
        event.setAmount(amount);
        event.setCreatedAt(DateHelper.getLocalDateTimeNow());
        return event;
    }

    List<AccountingEntry> getRepaymentOfInterestAccountingEntry(BorrowingEvent event) {
        return this.borrowingAccountingService.getInterestRepaymentAccountingEntry(event);
    }

    List<AccountingEntry> getRepaymentOfPrincipalAccountingEntry(BorrowingEvent event) {
        return this.borrowingAccountingService.getPrincipalRepaymentAccountingEntry(event);
    }
}
