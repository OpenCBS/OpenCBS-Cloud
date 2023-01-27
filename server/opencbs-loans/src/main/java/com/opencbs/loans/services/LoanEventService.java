package com.opencbs.loans.services;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.enums.EventTypeGroup;
import com.opencbs.core.dto.requests.EventRequest;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.ContractAccountingEntryService;
import com.opencbs.loans.audit.LoanAuditEventIdentificator;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.domain.LoanRollBackEvent;
import com.opencbs.loans.repositories.LoanEventRepository;
import com.opencbs.loans.services.loancloseday.LoanAnalyticsDayClosureProcessor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class LoanEventService implements ContractAccountingEntryService {

    private static final LocalTime MIN_USER_EVENT_TIME = LocalTime.of(6,0,0);
    private final LoanEventRepository loanEventRepository;
    private final LoanAnalyticsDayClosureProcessor loanAnalyticsProcess;
    private final LoanPenaltyEventService loanPenaltyEventService;


    public List<LoanEvent> findAllConsolidatedByLoanId(Long loanId, EventRequest request) {
        List<LoanEvent> allEvents =
                this.loanEventRepository.findAllByLoanId(loanId);
        if (!request.isShowSystem()) {
            allEvents = allEvents
                    .stream()
                    .filter(x -> !x.isSystem())
                    .collect(Collectors.toList());
        }

        if (!request.isShowDeleted()) {
            allEvents = allEvents
                    .stream()
                    .filter(x -> !x.getDeleted())
                    .collect(Collectors.toList());
        }
        List<LoanEvent> eventsWithGroup = allEvents
                .stream()
                .filter(
                        x -> x.getEventType().getEventTypeGroup() != null)
                .collect(Collectors.toList());
        Map<Long, List<LoanEvent>> eventsGrouped = eventsWithGroup
                .stream()
                .collect(Collectors.groupingBy(LoanEvent::getGroupKey));
        List<LoanEvent> eventsConsolidated = this.getConsolidatedEvents(eventsGrouped);

        List<LoanEvent> result = allEvents
                .stream()
                .filter(x -> x.getEventType().getEventTypeGroup() == null)
                .collect(Collectors.toList());
        result.addAll(eventsConsolidated);

        if (request.isShowSystem()) {
            result.addAll(this.loanPenaltyEventService.getAllEventsByLoanId(loanId, request.isShowDeleted()).stream()
                    .map(lpe -> {
                        ModelMapper mapper = new ModelMapper();
                        return mapper.map(lpe, LoanEvent.class);
                    }).collect(Collectors.toList()));
        }

        return result;
    }

    private List<LoanEvent> getConsolidatedEvents(Map<Long, List<LoanEvent>> eventsGrouped) {
        List<LoanEvent> result = new ArrayList<>();
        for (Map.Entry<Long, List<LoanEvent>> events : eventsGrouped.entrySet()) {
            LoanEvent event = new LoanEvent();
            LoanEvent first = events.getValue().stream().findFirst().get();

            if (events.getValue().size() == 1) {
                result.add(first);
                continue;
            }
            first = this.setVirtualName(first);

            event.setId(0L);
            BigDecimal totalAmount = events.getValue()
                    .stream()
                    .map(LoanEvent::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            event.setAmount(totalAmount);
            event.setEventType(first.getEventType());
            event.setCreatedAt(first.getCreatedAt());
            event.setCreatedById(first.getCreatedById());
            event.setLoanId(first.getLoanId());
            event.setEffectiveAt(first.getEffectiveAt());
            event.setDeleted(!events.getValue().stream().anyMatch(x -> !x.getDeleted()));
            event.setInstallmentNumber(null);
            event.setGroupKey(events.getKey());

            result.add(event);
        }
        return result;
    }

    //todo Rewrite this hardcode
    private LoanEvent setVirtualName(LoanEvent event) {
        switch (event.getEventType()) {
            case DISBURSEMENT:
                event.setEventType(EventType.VIRTUAL_DISBURSEMENT);
                break;
            case REPAYMENT_OF_PRINCIPAL:
                event.setEventType(EventType.VIRTUAL_REPAYMENT);
                break;
            case REPAYMENT_OF_INTEREST:
                event.setEventType(EventType.VIRTUAL_REPAYMENT);
                break;
            case REPAYMENT_OF_PENALTY:
                event.setEventType(EventType.VIRTUAL_REPAYMENT);
                break;
            case WRITE_OFF_OLB:
                event.setEventType(EventType.VIRTUAL_WRITE_OFF);
                break;
            case WRITE_OFF_INTEREST:
                event.setEventType(EventType.VIRTUAL_WRITE_OFF);
                break;
            case WRITE_OFF_PENALTY:
                event.setEventType(EventType.VIRTUAL_WRITE_OFF);
                break;
        }
        return event;
    }

    public List<LoanEvent> findAllByLoanId(Long loanId) {
        return this.loanEventRepository.findAllByLoanId(loanId);
    }

    public List<LoanEvent> findAllByLoanId(Long loanId, EventRequest eventRequest) {
        List<LoanEvent> allEvents = this.loanEventRepository.findAllByLoanId(loanId);

        ModelMapper modelMapper = new ModelMapper();
        allEvents.addAll(
                this.loanPenaltyEventService.getAllEventsByLoanId(loanId, eventRequest.isShowDeleted()).stream()
                        .filter(loanPenaltyEvent -> EventType.ACCRUAL_OF_PENALTY.equals(loanPenaltyEvent.getEventType()))
                        .map(loanPenaltyEvent -> {
                            LoanEvent loanEvent = modelMapper.map(loanPenaltyEvent, LoanEvent.class);
                            return loanEvent;
                        })
                        .collect(Collectors.toList())
        );

        if (!eventRequest.isShowSystem()) {
            allEvents = allEvents
                    .stream()
                    .filter(x -> !x.isSystem())
                    .collect(Collectors.toList());
        }

        if (!eventRequest.isShowDeleted()) {
            allEvents = allEvents
                    .stream()
                    .filter(x -> !x.getDeleted())
                    .collect(Collectors.toList());
        }

        return allEvents.stream()
                .sorted((a, b) -> {
                    int num = a.getEffectiveAt().compareTo(b.getEffectiveAt());
                    if (num == 0) {
                        return a.getEventType().compareTo(b.getEventType());
                    }
                    return num;
                })
                .collect(Collectors.toList());
    }

    public Optional<LoanEvent> findLastEvent(Long loanId) {
        return this.loanEventRepository.findFirstByLoanIdAndDeletedFalseOrderByEffectiveAtDesc(loanId);
    }

    public Boolean isExistEventsAfterDate(Long loanId, List<EventType> evenTypes, LocalDateTime dateTime){
        return this.loanEventRepository.existsByLoanIdAndEffectiveAtAfterAndEventTypeInAndDeletedIsFalse(loanId, dateTime, evenTypes);
    }

    public List<LoanEvent> findAllByLoanIdAndDeletedAndEventType(Long loanId, boolean isDeleted, EventType eventType) {
        return this.loanEventRepository.findAllByLoanIdAndDeletedAndEventType(loanId, isDeleted, eventType);
    }

    public List<LoanEvent> findAllByLoanIdAndDeletedAndEventTypeAndDate(Long loanId, boolean isDeleted, EventType eventType, LocalDateTime localDateTime) {
        return this.loanEventRepository.findAllByLoanIdAndDeletedAndEventTypeAndEffectiveAt(loanId, isDeleted, eventType, localDateTime);
    }

    public List<LoanEvent> findAllByLoanIdAndEffectiveAt(Long loanId, LocalDateTime from, LocalDateTime to) {
        return this.loanEventRepository.findAllByLoanIdAndEffectiveAt(loanId, from, to);
    }

    public Optional<LocalDateTime> getDisbursementDate(@NonNull Long loanId) {
        return loanEventRepository.getDisbursementDate(loanId, EventType.DISBURSEMENT);
    }

    public List<LoanEvent> findAllByGroupKey(Long groupKey) {
        List<LoanEvent> allByGroupKey = this.loanEventRepository.findAllByGroupKey(groupKey);
        return allByGroupKey;
    }

    public Optional<LocalDateTime> findLastEventEffectiveAt(Long loanId) {
        final Optional<LocalDateTime> lastPenaltyEffectiveAt = this.loanPenaltyEventService.getLastEffectiveAt(loanId);
        final Optional<LocalDateTime> lastEventEffectiveAt = this.loanEventRepository.getLastEffectiveAt(loanId);

        return DateHelper.getMaxValue(lastEventEffectiveAt, lastPenaltyEffectiveAt);
    }

    public Optional<LocalDateTime> findMaxEventEffectiveAtByDate(Long loanId, LocalDate date) {
        final Optional<LocalDateTime> lastEventEffectiveAt = this.loanEventRepository.
                getMaxEffectiveAtBetweenDates(loanId, LocalDateTime.of(date, MIN_USER_EVENT_TIME), LocalDateTime.of(date, LocalTime.MAX));

        return lastEventEffectiveAt;
    }

    public LoanEvent saveDisbursement(LoanEvent loanEvent) throws Exception {
        if (loanEvent.getEventType() != EventType.DISBURSEMENT)
            throw new Exception("Can't save " + loanEvent.getEventType().toString() + " as disbursement event");
        return this.loanEventRepository.save(loanEvent);
    }

    public LoanEvent save(LoanEvent loanEvent) {
        LoanEvent result = this.loanEventRepository.save(loanEvent);
        saveAnalytic(loanEvent, loanEvent.getEffectiveAt());
        return result;
    }

    public LoanEvent saveWithoutAnalytic(LoanEvent loanEvent) {
        return this.loanEventRepository.save(loanEvent);
    }

    public Optional<LoanEvent> findById(Long id) {
        return Optional.ofNullable(this.loanEventRepository.findOne(id));
    }

    private void saveAnalytic(LoanEvent loanEvent, LocalDateTime dateTime) {
        User user = new User();
        user.setId(loanEvent.getCreatedById());

        this.loanAnalyticsProcess.processContract(loanEvent.getLoanId(), dateTime.toLocalDate(), user);
    }

    public List<LoanAuditEventIdentificator> getIdentificationsByPeriodAndUser(LocalDate fromDate, LocalDate toDate, User user) {
        Long userId = (user == null) ? null : user.getId();
        return this.loanEventRepository.getAllByEffectiveAtBetweenAndCreatedBy(LocalDateTime.of(fromDate, LocalTime.MIN), LocalDateTime.of(toDate, LocalTime.MAX), userId);
    }

    @Override
    public List<Long> getIdsAccountEntriesWithEvent(LocalDate fromDate, LocalDate toDate, User user) {
        final List<Long> collect = this.getIdentificationsByPeriodAndUser(fromDate, toDate, user).stream()
                .map(LoanAuditEventIdentificator::getLoanEventId).collect(Collectors.toList());

        Set<Long> set = new HashSet<>();
        for (LoanEvent loanEvent : this.loanEventRepository.findAll(collect)) {
            set.addAll(loanEvent.getAccountingEntry().stream()
                    .mapToLong(AccountingEntry::getId)
                    .boxed().collect(Collectors.toSet())
            );
        }

        List<Long> identifications = new ArrayList<>();
        identifications.addAll(set);
        return identifications;
   }

    public List<LoanRollBackEvent> getRollbackEvents(LocalDate fromDate, LocalDate toDate, User user) {
        Long userId = (user == null) ? null : user.getId();
        List<LoanRollBackEvent> rollbackEvents = this.loanEventRepository.getAllRoolbackEventsByDateAndUser(LocalDateTime.of(fromDate, LocalTime.MIN), LocalDateTime.of(toDate, LocalTime.MAX), userId);

        return rollbackEvents;
    }

    public boolean isExistsRepaymentEventWasLateDate(Long loanId, LocalDate dateTime) {
        final List<EventType> events = Arrays.stream(EventType.values())
                .filter(eventType -> EventTypeGroup.REPAYMENT.equals(eventType.getEventTypeGroup()))
                .collect(Collectors.toList());
        return this.isExistEventsAfterDate(loanId, events, LocalDateTime.of(dateTime, LocalTime.MAX));
    }

    public void moveEventsToInstallment(@NonNull List<Long> eventIds, @NonNull LoanInstallment loanInstallment) {
        if (CollectionUtils.isEmpty(eventIds)) {
            return;
        }

        List<LoanEvent> events = this.loanEventRepository.findAll(eventIds);

        events.forEach(event->{
            event.setInstallmentNumber(loanInstallment.getNumber());
            event.setGroupKey(loanInstallment.getEventGroupKey());
        });

        this.loanEventRepository.save(events);
    }

    public Optional<LoanEvent> getLastEvent(Long loanId, EventType eventType, LocalDateTime localDateTime) {
        return this.findAllByLoanIdAndDeletedAndEventType(loanId, false, eventType).stream()
                .filter(loanEvent -> DateHelper.lessOrEqual(loanEvent.getEffectiveAt(), localDateTime))
                .max(Comparator.comparing(LoanEvent::getEffectiveAt));
    }

    public List<LoanEvent>  getEventsBetweenDates(Long loanId, EventType eventType, LocalDate beginDate, LocalDate endDate) {
        return this.loanEventRepository.findAllByLoanIdAndDeletedAndEventTypeAndEffectiveAtBetween(loanId, false, eventType,
                LocalDateTime.of(beginDate, LocalTime.MIN), LocalDateTime.of(endDate, LocalTime.MAX));
    }

    public List<LoanEvent> getEventByTypes(Long loanId, List<EventType> eventTypes) {
        return this.loanEventRepository.findByLoanIdAndEventTypeInAndDeletedIsFalse(loanId, eventTypes);
    }
}
