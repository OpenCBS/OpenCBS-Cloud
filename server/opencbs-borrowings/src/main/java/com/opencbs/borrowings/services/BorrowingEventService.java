package com.opencbs.borrowings.services;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.BorrowingEvent;
import com.opencbs.borrowings.repositories.BorrowingEventRepository;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.dto.requests.EventRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BorrowingEventService {

    private final BorrowingEventRepository borrowingEventRepository;

    @Autowired
    public BorrowingEventService(BorrowingEventRepository borrowingEventRepository) {
        this.borrowingEventRepository = borrowingEventRepository;
    }

    @Transactional
    public BorrowingEvent create(BorrowingEvent event) {
        return this.borrowingEventRepository.save(event);
    }

    public List<BorrowingEvent> findByAccountingEntry(AccountingEntry accountingEntry) {
        return this.borrowingEventRepository.findAllByAccountingEntry(accountingEntry);
    }

    public List<BorrowingEvent> findAllConsolidatedByBorrowingId(Long borrowingId, EventRequest request) {
        List<BorrowingEvent> allEvents =
                this.sortByRequest(this.borrowingEventRepository.findAllByBorrowingId(borrowingId), request);

        List<BorrowingEvent> eventsWithGroup = allEvents
                .stream()
                .filter(x -> x.getEventType().getEventTypeGroup() != null)
                .collect(Collectors.toList());

        Map<Long, List<BorrowingEvent>> eventsGrouped = eventsWithGroup
                .stream()
                .collect(Collectors.groupingBy(BorrowingEvent::getGroupKey));

        List<BorrowingEvent> eventsConsolidated = this.getConsolidatedEvents(eventsGrouped);

        List<BorrowingEvent> result = allEvents
                .stream()
                .filter(x -> x.getEventType().getEventTypeGroup() == null)
                .collect(Collectors.toList());
        result.addAll(eventsConsolidated);

        return result;
    }

    public List<BorrowingEvent> findAllByBorrowingId(Long borrowingId) {
        return this.borrowingEventRepository.findAllByBorrowingId(borrowingId);
    }

    public List<BorrowingEvent> findAllByGroupKey(Long groupKey) {
        return this.borrowingEventRepository.findAllByGroupKey(groupKey);
    }

    public BorrowingEvent save(BorrowingEvent borrowingEvent) {
        return this.borrowingEventRepository.save(borrowingEvent);
    }

    public List<BorrowingEvent> findAllByBorrowingAndEventTypeAndDeleted(Borrowing borrowing, EventType eventType, boolean deleted){
        return this.borrowingEventRepository.findAllByBorrowingIdAndEventTypeAndDeleted(borrowing.getId(), eventType, deleted);
    }

    public Optional<BorrowingEvent> findLastEvent(Long borrowingId) {
        return this.borrowingEventRepository.findFirstByBorrowingIdAndDeletedFalseOrderByEffectiveAtDesc(borrowingId);
    }

    public List<BorrowingEvent> findByBorrowingIdAndEffectiveAt(Long borrowingId, LocalDateTime from, LocalDateTime to) {
        return this.borrowingEventRepository.findByBorrowingIdAndEffectiveAt(borrowingId, from, to);
    }

    private List<BorrowingEvent> sortByRequest(List<BorrowingEvent> allByGroupKey, EventRequest request) {
        if (!request.isShowSystem()) {
            allByGroupKey = allByGroupKey
                    .stream()
                    .filter(x -> !x.isSystem())
                    .collect(Collectors.toList());
        }

        if (!request.isShowDeleted()) {
            allByGroupKey = allByGroupKey
                    .stream()
                    .filter(x -> !x.getDeleted())
                    .collect(Collectors.toList());
        }
        return allByGroupKey;
    }

    //TODO: move hashmap to appropriate place
    private BorrowingEvent setVirtualName(BorrowingEvent event) {
        HashMap<EventType, EventType> map = new HashMap<>();
        map.put(EventType.DISBURSEMENT, EventType.VIRTUAL_DISBURSEMENT);
        map.put(EventType.REPAYMENT_OF_PRINCIPAL, EventType.VIRTUAL_REPAYMENT);
        map.put(EventType.REPAYMENT_OF_INTEREST, EventType.VIRTUAL_REPAYMENT);
        map.put(EventType.REPAYMENT_OF_PENALTY, EventType.VIRTUAL_REPAYMENT);
        map.put(EventType.WRITE_OFF_OLB, EventType.VIRTUAL_WRITE_OFF);
        map.put(EventType.WRITE_OFF_INTEREST, EventType.VIRTUAL_WRITE_OFF);
        map.put(EventType.WRITE_OFF_PENALTY, EventType.VIRTUAL_WRITE_OFF);

        event.setEventType(map.get(event.getEventType()));
        return event;
    }

    private List<BorrowingEvent> getConsolidatedEvents(Map<Long, List<BorrowingEvent>> eventsGrouped) {
        List<BorrowingEvent> result = new ArrayList<>();
        for (Map.Entry<Long, List<BorrowingEvent>> events : eventsGrouped.entrySet()) {
            BorrowingEvent event = new BorrowingEvent();
            BorrowingEvent first = events.getValue().stream().findFirst().get();

            if (events.getValue().size() == 1) {
                result.add(first);
                continue;
            }
            first = this.setVirtualName(first);

            event.setId(0L);
            BigDecimal totalAmount = events.getValue()
                    .stream()
                    .map(BorrowingEvent::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            event.setAmount(totalAmount);
            event.setEventType(first.getEventType());
            event.setCreatedAt(first.getCreatedAt());
            event.setCreatedById(first.getCreatedById());
            event.setBorrowingId(first.getBorrowingId());
            event.setEffectiveAt(first.getEffectiveAt());
            event.setDeleted(!events.getValue().stream().anyMatch(x -> !x.getDeleted()));
            event.setInstallmentNumber(null);
            event.setGroupKey(events.getKey());

            result.add(event);
        }
        return result;
    }
}
