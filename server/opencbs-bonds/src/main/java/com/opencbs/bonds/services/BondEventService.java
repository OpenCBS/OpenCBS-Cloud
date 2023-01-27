package com.opencbs.bonds.services;

import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.repositories.BondEventRepository;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.dto.requests.EventRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BondEventService {

    private final BondEventRepository bondEventRepository;

    @Autowired
    public BondEventService(BondEventRepository bondEventRepository) {
        this.bondEventRepository = bondEventRepository;
    }

    public List<BondEvent> findAllByBondId(Long bondId) {
        return this.bondEventRepository.findAllByBondId(bondId);
    }

    public BondEvent save(BondEvent bondEvent) {
        return this.bondEventRepository.save(bondEvent);
    }

    public List<BondEvent> findAllConsolidatedByBondId(Long bondId, EventRequest request) {
        List<BondEvent> allEvents =
                this.sortByRequest(this.bondEventRepository.findAllByBondId(bondId), request);

        List<BondEvent> eventsWithGroup = allEvents
                .stream()
                .filter(x -> x.getEventType().getEventTypeGroup() != null)
                .collect(Collectors.toList());

        Map<Long, List<BondEvent>> eventsGrouped = eventsWithGroup
                .stream()
                .collect(Collectors.groupingBy(BondEvent::getGroupKey));

        List<BondEvent> eventsConsolidated = this.getConsolidatedEvents(eventsGrouped);

        List<BondEvent> result = allEvents
                .stream()
                .filter(x -> x.getEventType().getEventTypeGroup() == null)
                .collect(Collectors.toList());

        result.addAll(eventsConsolidated);

        return result;
    }

    public List<BondEvent> findAllByGroupKey(Long groupKey) {
        return this.bondEventRepository.findAllByGroupKey(groupKey);
    }

    public Optional<BondEvent> findLastEvent(Long bondId) {
        return this.bondEventRepository.findFirstByBondIdAndDeletedFalseOrderByEffectiveAtDesc(bondId);
    }

    public List<BondEvent> findAllByBondIdAndEffectiveAt(Long bondId, LocalDateTime from, LocalDateTime to) {
        return this.bondEventRepository.findAllByBondIdAndEffectiveAt(bondId, from, to);
    }

    private List<BondEvent> sortByRequest(List<BondEvent> allByGroupKey, EventRequest request) {
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

    private List<BondEvent> getConsolidatedEvents(Map<Long, List<BondEvent>> eventsGrouped) {
        List<BondEvent> result = new ArrayList<>();
        for (Map.Entry<Long, List<BondEvent>> events : eventsGrouped.entrySet()) {
            BondEvent event = new BondEvent();
            BondEvent first = events.getValue().stream().findFirst().get();

            if (events.getValue().size() == 1) {
                result.add(first);
                continue;
            }

            first = this.setVirtualName(first);

            event.setId(0L);
            BigDecimal totalAmount = events.getValue()
                    .stream()
                    .map(BondEvent::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            event.setAmount(totalAmount);
            event.setEventType(first.getEventType());
            event.setCreatedAt(first.getCreatedAt());
            event.setCreatedById(first.getCreatedById());
            event.setBondId(first.getBondId());
            event.setEffectiveAt(first.getEffectiveAt());
            event.setDeleted(!events.getValue().stream().anyMatch(x -> !x.getDeleted()));
            event.setInstallmentNumber(null);
            event.setGroupKey(events.getKey());

            result.add(event);
        }

        return result;
    }

    private BondEvent setVirtualName(BondEvent event) {
        HashMap<EventType, EventType> map = new HashMap<>();
        map.put(EventType.DISBURSEMENT, EventType.VIRTUAL_DISBURSEMENT);
        map.put(EventType.REPAYMENT_OF_PRINCIPAL, EventType.VIRTUAL_REPAYMENT);
        map.put(EventType.REPAYMENT_OF_INTEREST, EventType.VIRTUAL_REPAYMENT);
        map.put(EventType.REPAYMENT_OF_PENALTY, EventType.VIRTUAL_REPAYMENT);

        event.setEventType(map.get(event.getEventType()));
        return event;
    }

    public List<BondEvent> findAllByBondIdAndDeletedAndEventTypeAndEffectiveAt(Long bondId, boolean isDeleted, EventType eventType, LocalDateTime localDateTime){
        return this.bondEventRepository.findAllByBondIdAndDeletedAndEventTypeAndEffectiveAtBefore(bondId, isDeleted, eventType, localDateTime);
    }
}
