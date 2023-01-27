package com.opencbs.borrowings.services;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.BorrowingEvent;
import com.opencbs.borrowings.domain.BorrowingExtended;
import com.opencbs.borrowings.domain.SimplifiedBorrowing;
import com.opencbs.borrowings.domain.enums.BorrowingStatus;
import com.opencbs.borrowings.domain.schedule.BorrowingInstallment;
import com.opencbs.borrowings.repositories.BorrowingEventRepository;
import com.opencbs.borrowings.repositories.BorrowingInstallmentRepository;
import com.opencbs.borrowings.repositories.BorrowingRepository;
import com.opencbs.borrowings.repositories.implementations.BorrowingGroupKeyRepository;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.schedulegenerators.ScheduleService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.script.ScriptException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.time.temporal.ChronoUnit.DAYS;
import static java.util.stream.Collectors.groupingBy;

@Service
public class BorrowingService {

    private final BorrowingRepository borrowingRepository;
    private final ModelMapper modelMapper = new ModelMapper();
    private final ScheduleService scheduleService;
    private final BorrowingGlobalSettingsService borrowingGlobalSettingsService;
    private final BorrowingEventService borrowingEventService;
    private final BorrowingInstallmentRepository borrowingInstallmentRepository;
    private final BorrowingEventRepository borrowingEventRepository;
    private final BorrowingGroupKeyRepository borrowingGroupKeyRepository;
    private final BorrowingAccountService borrowingAccountService;

    @Autowired
    public BorrowingService(BorrowingRepository borrowingRepository,
                            ScheduleService scheduleService,
                            BorrowingGlobalSettingsService borrowingGlobalSettingsService,
                            BorrowingEventService borrowingEventService,
                            BorrowingInstallmentRepository borrowingInstallmentRepository,
                            BorrowingEventRepository borrowingEventRepository,
                            BorrowingGroupKeyRepository borrowingGroupKeyRepository,
                            BorrowingAccountService borrowingAccountService) {
        this.borrowingRepository = borrowingRepository;
        this.scheduleService = scheduleService;
        this.borrowingGlobalSettingsService = borrowingGlobalSettingsService;
        this.borrowingEventService = borrowingEventService;
        this.borrowingInstallmentRepository = borrowingInstallmentRepository;
        this.borrowingEventRepository = borrowingEventRepository;
        this.borrowingGroupKeyRepository = borrowingGroupKeyRepository;
        this.borrowingAccountService = borrowingAccountService;
    }

    public Optional<Borrowing> findOne(Long id) {
        return Optional.ofNullable(this.borrowingRepository.findOne(id));
    }

    public Borrowing findById(Long id) throws ResourceNotFoundException {
        return this.borrowingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Borrowing is not found (ID=%d).", id)));
    }

    @Transactional
    public Borrowing firstSave(Borrowing borrowing) throws ResourceNotFoundException, ScriptException {
        List<BorrowingInstallment> installments = this.getInstallments(borrowing);
        for (BorrowingInstallment borrowingInstallment : installments)
            borrowingInstallment.setEffectiveAt(borrowing.getDisbursementDate());
        borrowing.setInstallments(installments);
        borrowing.setCode("");
        borrowing = this.borrowingRepository.save(borrowing);
        borrowing.setCode(this.borrowingGlobalSettingsService.generateBorrowingCode(borrowing));
        borrowing = this.borrowingRepository.save(borrowing);
        this.borrowingAccountService.createBorrowingAccounts(borrowing);
        return borrowing;
    }

    public List<BorrowingInstallment> getInstallmentsByBorrowing(Borrowing borrowing, LocalDateTime dateTime) {
        List<BorrowingInstallment> allByBorrowing = this.borrowingInstallmentRepository.findAllByBorrowing(borrowing);
        Map<Integer, List<BorrowingInstallment>> collect = allByBorrowing
                .stream()
                .filter(x -> (DateHelper.lessOrEqual(x.getEffectiveAt(), dateTime) && !x.getDeleted()))
                .collect(groupingBy(BorrowingInstallment::getNumber));
        List<BorrowingInstallment> installments = new ArrayList<>();
        for (Map.Entry<Integer, List<BorrowingInstallment>> integerListEntry : collect.entrySet()) {
            installments.add(integerListEntry
                    .getValue()
                    .stream()
                    .max(Comparator.comparing(BorrowingInstallment::getEventGroupKey))
                    .get());
        }
        return installments;
    }

    public BorrowingExtended getBorrowingExtended(Borrowing borrowing, LocalDateTime dateTime) {
        List<BorrowingInstallment> installments = this.getInstallmentsByBorrowing(borrowing, dateTime);

        List<BorrowingEvent> events =
                this.borrowingEventRepository.findAllByBorrowingIdAndDeletedFalse(borrowing.getId());

        BorrowingExtended borrowingExtended = new BorrowingExtended(borrowing);

        borrowingExtended.setEvents(events);
        borrowingExtended.setOutstandingInterest(this.getOutstandingInterest(events));

        BorrowingInstallment lastDueInstalment = this.getLastDueInstalment(installments, dateTime);

        if (lastDueInstalment != null) {
            borrowingExtended.setDueInterest(this.getDueInterest(events, lastDueInstalment.getMaturityDate()));
            borrowingExtended.setDuePrincipal(this.getDuePrincipal(events, lastDueInstalment.getMaturityDate()));
        }

        borrowingExtended.setOlb(this.getOlb(events, dateTime));
        borrowingExtended.setLateDays(this.getLateDays(installments, dateTime));
        borrowingExtended.setLastAccrualDate(this.getLastAccrualDate(events, dateTime));
        borrowingExtended.setInstallments(installments);
        BorrowingInstallment currentInstallment = this.getCurrentInstallment(installments, dateTime);
        borrowingExtended.setCurrentInstallment(currentInstallment);
        borrowingExtended.setCurrentInstallmentByLastAccrualDay(this.getCurrentInstallmentByLastAccrualDay(installments, dateTime));

        return borrowingExtended;
    }

    @Transactional
    public Borrowing save(Borrowing borrowing) {
        return this.borrowingRepository.save(borrowing);
    }

    private BorrowingInstallment getCurrentInstallment(
            List<BorrowingInstallment> installments,
            LocalDateTime dateTime) {

        Optional<BorrowingInstallment> current = installments
                .stream()
                .filter(x -> DateHelper.greaterOrEqual(x.getMaturityDate(), dateTime.toLocalDate()))
                .min(
                        Comparator.comparing(BorrowingInstallment::getMaturityDate));
        if (current.isPresent()) {
            return current.get();
        }
        Optional<BorrowingInstallment> max = installments
                .stream()
                .filter(x -> DateHelper.lessOrEqual(x.getMaturityDate(), dateTime.toLocalDate()))
                .max(
                        Comparator.comparing(BorrowingInstallment::getMaturityDate));
        if (max.isPresent()) {
            return max.get();
        }
        return null;
    }

    private BorrowingInstallment getCurrentInstallmentByLastAccrualDay(
            List<BorrowingInstallment> installments,
            LocalDateTime dateTime) {

        Optional<BorrowingInstallment> current = installments
                .stream()
                .filter(x -> DateHelper.greaterOrEqual(x.getLastAccrualDate(), dateTime.toLocalDate()))
                .min(Comparator.comparing(BorrowingInstallment::getLastAccrualDate));

        if (current.isPresent()) {
            return current.get();
        }
        Optional<BorrowingInstallment> max = installments
                .stream()
                .filter(x -> DateHelper.lessOrEqual(x.getLastAccrualDate(), dateTime.toLocalDate()))
                .max(
                        Comparator.comparing(BorrowingInstallment::getLastAccrualDate));
        if (max.isPresent()) {
            return max.get();
        }
        return null;
    }

    private Optional<LocalDateTime> getLastAccrualDate(List<BorrowingEvent> events, LocalDateTime dateTime) {
        return events
                .stream().
                        filter(x -> DateHelper.lessOrEqual(x.getEffectiveAt(), dateTime)
                                && x.getEventType().equals(EventType.ACCRUAL_OF_INTEREST))
                .map(x -> x.getEffectiveAt())
                .max(LocalDateTime::compareTo);
    }

    private long getLateDays(List<BorrowingInstallment> installments, LocalDateTime dateTime) {
        BorrowingInstallment firstDueInstalment = this.getFirstDueInstalment(installments, dateTime);
        if (firstDueInstalment != null) {
            return DAYS.between(firstDueInstalment.getMaturityDate(), dateTime.toLocalDate());
        }
        return 0;
    }

    private BigDecimal getOlb(List<BorrowingEvent> events, LocalDateTime dateTime) {
        return this.getDisbursedAmount(events, dateTime).subtract(this.getRepaidAmount(events, dateTime));
    }

    private BigDecimal getDuePrincipal(List<BorrowingEvent> events, LocalDate date) {
        List<BorrowingEvent> localEvents = events
                .stream()
                .filter(
                        x -> DateHelper.lessOrEqual(x.getEffectiveAt().toLocalDate(), date)
                )
                .collect(Collectors.toList());
        return this.getOlb(localEvents, LocalDateTime.of(date, LocalTime.MIN));
    }

    private BigDecimal getDisbursedAmount(List<BorrowingEvent> events, LocalDateTime dateTime) {
        return events
                .stream()
                .filter(x -> DateHelper.lessOrEqual(x.getEffectiveAt(), dateTime))
                .filter(
                        x -> Arrays.asList(EventType.DISBURSEMENT).contains(x.getEventType())
                )
                .map(x -> x.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getRepaidAmount(List<BorrowingEvent> events, LocalDateTime dateTime) {
        return events
                .stream()
                .filter(
                        x -> Arrays.asList(
                                EventType.REPAYMENT_OF_PRINCIPAL,
                                EventType.WRITE_OFF_OLB
                        ).contains(x.getEventType())
                )
                .map(x -> x.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BorrowingInstallment getLastDueInstalment(
            List<BorrowingInstallment> installments,
            LocalDateTime dateTime) {
        Optional<BorrowingInstallment> max = installments
                .stream()
                .filter(
                        x -> DateHelper.lessOrEqual(x.getEffectiveAt(), dateTime))
                .filter(
                        x -> x.getInterest().add(x.getPrincipal())
                                .subtract(x.getPaidInterest().add(x.getPaidPrincipal())).longValue() > 0)
                .max(Comparator.comparing(BorrowingInstallment::getMaturityDate));
        if (max.isPresent()) {
            return max.get();
        }
        return null;
    }

    private BorrowingInstallment getFirstDueInstalment(
            List<BorrowingInstallment> installments,
            LocalDateTime dateTime) {
        Optional<BorrowingInstallment> min = installments
                .stream()
                .filter(
                        x -> DateHelper.lessOrEqual(x.getEffectiveAt(), dateTime))
                .filter(
                        x -> x.getInterest().add(x.getPrincipal())
                                .subtract(x.getPaidInterest().add(x.getPaidPrincipal())).longValue() > 0).
                        min(Comparator.comparing(BorrowingInstallment::getMaturityDate));
        if (min.isPresent()) {
            return min.get();
        }
        return null;
    }

    private BigDecimal getDueInterest(List<BorrowingEvent> events, LocalDate lastDueDate) {
        List<BorrowingEvent> collect = events.stream()
                .filter(
                        x -> DateHelper.lessOrEqual(x.getCreatedAt().toLocalDate(), lastDueDate))
                .collect(Collectors.toList());
        return this.getOutstandingInterest(collect);
    }

    private BigDecimal getOutstandingInterest(List<BorrowingEvent> borrowingEvents) {
        return borrowingEvents
                .stream()
                .filter(
                        x -> Arrays.asList(
                                EventType.ACCRUAL_OF_INTEREST,
                                EventType.REPAYMENT_OF_INTEREST,
                                EventType.WRITE_OFF_INTEREST
                        ).contains(x.getEventType())).map(
                        x -> {
                            if (Arrays.asList(
                                    EventType.ACCRUAL_OF_INTEREST,
                                    EventType.WRITE_OFF_INTEREST
                            ).contains(x.getEventType())) {
                                return x.getAmount().negate();
                            }
                            return x.getAmount();
                        }
                )
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private ScheduleParams getScheduleParams(Borrowing borrowing) {
        ScheduleParams map = this.modelMapper.map(borrowing, ScheduleParams.class);
        if (borrowing.getDisbursementDate() != null && map.getDisbursementDate() == null) {
            map.setDisbursementDate(borrowing.getDisbursementDate().toLocalDate());
        }
        return map;
    }

    public List<BorrowingInstallment> getInstallments(Borrowing borrowing) {
        List<Installment> installments =
                this.scheduleService.getSchedule(this.getScheduleParams(borrowing));

        LocalDateTime now = LocalDateTime.now();
        return installments
                .stream()
                .map(x -> {
                    BorrowingInstallment borrowingInstallment =
                            this.modelMapper.map(x, BorrowingInstallment.class);
                    borrowingInstallment.setBorrowing(borrowing);
                    borrowingInstallment.setEffectiveAt(now);
                    borrowingInstallment.setRescheduled(false);
                    return borrowingInstallment;
                })
                .collect(Collectors.toList());
    }

    public List<BorrowingInstallment> preview(Borrowing borrowing) {
        return this.getInstallments(borrowing);
    }

    BorrowingEvent createBorrowingDisbursementEvent(Borrowing borrowing, User currentUser) {
        BorrowingEvent borrowingEvent = this.getDisbursementEvent(borrowing, currentUser);
        borrowingEvent.setBorrowingId(borrowing.getId());
        borrowingEvent.setAmount(borrowing.getAmount());
        return borrowingEvent;
    }

    private BorrowingEvent getDisbursementEvent(Borrowing borrowing, User currentUser) {
        BorrowingEvent borrowingDisbursementEvent = new BorrowingEvent();
        borrowingDisbursementEvent.setEventType(EventType.DISBURSEMENT);
        borrowingDisbursementEvent.setCreatedAt(LocalDateTime.now());
        borrowingDisbursementEvent.setCreatedById(currentUser.getId());
        borrowingDisbursementEvent.setEffectiveAt(LocalDateTime.of(borrowing.getDisbursementDate().toLocalDate(), DateHelper.getLocalTimeNow()));
        borrowingDisbursementEvent.setGroupKey(this.borrowingGroupKeyRepository.getNextEventGroupKey());
        return borrowingDisbursementEvent;
    }

    public Page<Borrowing> getByProfile(Pageable pageable, Profile profile) {
        return this.borrowingRepository.findByProfile(pageable, profile);
    }

    public void saveBorrowingSchedule(Borrowing borrowing, BorrowingEvent borrowingEvent) {
        this.findAllByBorrowingId(borrowing.getId())
                .stream()
                .forEach(borrowingInstallment -> {
                    borrowingInstallment.setEffectiveAt(borrowingEvent.getEffectiveAt());
                    borrowingInstallment.setEventGroupKey(borrowingEvent.getGroupKey());
                    borrowingInstallment.setDeleted(false);
                    this.borrowingInstallmentRepository.save(borrowingInstallment);
                });
    }

    @Transactional
    public Borrowing update(Borrowing borrowing) throws ScriptException, ResourceNotFoundException {
        borrowing.setInstallments(this.getInstallments(borrowing));
        borrowing.setCode(this.borrowingGlobalSettingsService.generateBorrowingCode(borrowing));
        return this.borrowingRepository.save(borrowing);
    }

    public Page<SimplifiedBorrowing> getAll(String searchString, Pageable pageable) {
        if (searchString == null) {
            return this.borrowingRepository.getAll("", pageable);
        }
        return this.borrowingRepository.getAll(searchString, pageable);
    }

    public List<BorrowingInstallment> getInstallment(Borrowing borrowing) {
        List<BorrowingEvent> accrualEvents = this.borrowingEventService
                .findAllByBorrowingAndEventTypeAndDeleted(borrowing, EventType.ACCRUAL_OF_INTEREST, false);

        Map<Integer, List<BorrowingEvent>> groupedAccrualEvents =
                accrualEvents.stream()
                        .collect(groupingBy(BorrowingEvent::getInstallmentNumber));

        List<BorrowingInstallment> installments =
                this.getInstallmentsByBorrowing(borrowing, LocalDateTime.now());

        installments.forEach(x -> {
            if (groupedAccrualEvents.containsKey(x.getNumber())) {
                BigDecimal reduce = groupedAccrualEvents.get(x.getNumber())
                        .stream()
                        .map(BorrowingEvent::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                x.setAccruedInterest(reduce);
            }
        });
        return installments;
    }

    public List<Long> getActiveBorrowingIds(Branch branch) {
        return this.borrowingRepository.findIdsWhenBorrowingHasStatus(BorrowingStatus.ACTIVE, branch);
    }

    public List<BorrowingInstallment> findAllByBorrowingId(Long borrowingId) {
        return this.borrowingInstallmentRepository.findAllByBorrowingIdAndDeletedFalse(borrowingId);
    }
}
