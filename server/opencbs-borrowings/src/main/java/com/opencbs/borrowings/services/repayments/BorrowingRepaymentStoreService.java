package com.opencbs.borrowings.services.repayments;

import com.opencbs.borrowings.domain.BorrowingEvent;
import com.opencbs.borrowings.domain.enums.BorrowingStatus;
import com.opencbs.borrowings.domain.schedule.BorrowingInstallment;
import com.opencbs.borrowings.repositories.BorrowingInstallmentRepository;
import com.opencbs.borrowings.repositories.implementations.BorrowingGroupKeyRepository;
import com.opencbs.borrowings.services.BorrowingEventService;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.annotations.CustomAccountingService;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.repositories.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Service
@ConditionalOnMissingBean(annotation = CustomAccountingService.class)
public class BorrowingRepaymentStoreService {
    private final BorrowingEventService borrowingEventService;
    private final BorrowingGroupKeyRepository borrowingGroupKeyRepository;
    protected final BranchRepository branchRepository;
    private final BorrowingInstallmentRepository borrowingInstallmentRepository;
    protected final AccountingEntryService accountingEntryService;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public BorrowingRepaymentStoreService(BorrowingEventService borrowingEventService,
                                          BorrowingGroupKeyRepository borrowingGroupKeyRepository,
                                          BranchRepository branchRepository,
                                          BorrowingInstallmentRepository borrowingInstallmentRepository,
                                          AccountingEntryService accountingEntryService) {
        this.borrowingEventService = borrowingEventService;
        this.borrowingGroupKeyRepository = borrowingGroupKeyRepository;
        this.branchRepository = branchRepository;
        this.borrowingInstallmentRepository = borrowingInstallmentRepository;
        this.accountingEntryService = accountingEntryService;
    }

    @Transactional(isolation = Isolation.READ_UNCOMMITTED)
    void save(BorrowingRepaymentBaseService.RepaymentResult result) {
        result.getInstallments().forEach(x -> entityManager.detach(x));
        LocalDateTime now = LocalDateTime.now();

        Long groupKey = this.borrowingGroupKeyRepository.getNextEventGroupKey();

        result.getInstallments()
                .stream()
                .filter(i -> result.getAffectedNumbers().contains(i.getNumber()))
                .map(BorrowingInstallment::new)
                .forEach(i -> {
                    i.setEventGroupKey(groupKey);
                    i.setEffectiveAt(result.getTimestamp());
                    i.setBorrowing(result.getBorrowing());
                    i.setRescheduled(false);
                    this.borrowingInstallmentRepository.save(i);
                });
        HashMap<BorrowingEvent, List<AccountingEntry>> borrowingAccountingEntries = new HashMap<>();

        this.setNullAccountingEntries(result.getEvents(), borrowingAccountingEntries);
        this.saveBorrowingEvents(result.getEvents(), now, result, groupKey);

        this.saveAccountingEntries(result.getAccountingEntries(), result.getCurrentUser(), result.getBorrowing().getId());
        this.addAccountingEntriesBorrowingEvents(result.getEvents(), borrowingAccountingEntries);

        // Check if the loan is fully repaid and if yes then generate the closing event
        boolean borrowingRepaid = result.getInstallments()
                .parallelStream()
                .allMatch(BorrowingInstallment::isPaid);
        if (!borrowingRepaid) return;
        BorrowingEvent closingEvent = new BorrowingEvent();
        closingEvent.setEventType(EventType.CLOSED);
        closingEvent.setCreatedAt(now);
        closingEvent.setCreatedById(result.getCurrentUser().getId());
        closingEvent.setGroupKey(groupKey);
        closingEvent.setEffectiveAt(result.getTimestamp());
        closingEvent.setBorrowingId(result.getBorrowing().getId());
        closingEvent.setAmount(BigDecimal.ZERO);
        result.getBorrowing().setStatus(BorrowingStatus.CLOSED);
        this.borrowingEventService.save(closingEvent);
    }

    protected void saveAccountingEntries(List<AccountingEntry> accountingEntries, User user, Long borrowingId) {
        Branch branch = this.branchRepository.findAll().stream().findFirst().orElse(null);
        for (AccountingEntry accountingEntry : accountingEntries) {
            accountingEntry.setCreatedAt(LocalDateTime.now());
            accountingEntry.setCreatedBy(user);
            accountingEntry.setBranch(branch);
            this.accountingEntryService.create(accountingEntry);
        }
    }

    private void saveBorrowingEvents(List<BorrowingEvent> borrowingEvents, LocalDateTime dateTime,
                                     BorrowingRepaymentBaseService.RepaymentResult result, Long groupKey) {
        for (BorrowingEvent borrowingEvent : borrowingEvents) {
            borrowingEvent.setGroupKey(groupKey);
            this.borrowingEventService.save(borrowingEvent);
        }
    }

    private void setNullAccountingEntries(List<BorrowingEvent> borrowingEvents, HashMap<BorrowingEvent, List<AccountingEntry>> borrowingListHashMap){
        for (BorrowingEvent borrowingEvent : borrowingEvents){
            borrowingListHashMap.put(borrowingEvent, borrowingEvent.getAccountingEntry());
            borrowingEvent.setAccountingEntry(null);
        }
    }

    private void addAccountingEntriesBorrowingEvents(List<BorrowingEvent> borrowingEvents, HashMap<BorrowingEvent, List<AccountingEntry>> borrowingListHashMap){
        for (BorrowingEvent borrowingEvent : borrowingEvents){
            List<AccountingEntry> accountingEntries = borrowingListHashMap.get(borrowingEvent);
            borrowingEvent.setAccountingEntry(accountingEntries);
            this.borrowingEventService.save(borrowingEvent);
        }
    }
}
