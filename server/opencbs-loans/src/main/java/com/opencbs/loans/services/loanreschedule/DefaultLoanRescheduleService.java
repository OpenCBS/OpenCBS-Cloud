package com.opencbs.loans.services.loanreschedule;

import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.dto.ManualEditRescheduleDto;
import com.opencbs.core.dto.RescheduleDto;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.EventGroupKeyService;
import com.opencbs.core.services.schedulegenerators.ScheduleService;
import com.opencbs.loans.annotations.CustomLoanInstallmentRescheduleService;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanInfo;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.mappers.LoanScheduleMapper;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.services.LoanEventService;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.services.loancloseday.LoanAnalyticsDayClosureProcessor;
import com.opencbs.loans.services.repayment.impl.InstallmentsHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
@ConditionalOnMissingBean(annotation = CustomLoanInstallmentRescheduleService.class)
public class DefaultLoanRescheduleService implements LoanRescheduleService {

    private final ScheduleService scheduleService;
    private final LoanInstallmentRepository loanInstallmentRepository;
    private final EventGroupKeyService eventGroupKeyService;
    private final LoanEventService loanEventService;
    private final LoanService loanService;
    private final LoanAnalyticsDayClosureProcessor loanAnalyticsProcess;
    private final LoanScheduleMapper loanScheduleMapper;


    @Override
    public List<LoanInstallment> preview(Loan loan, RescheduleDto rescheduleDto) {
        final List<LoanInstallment> installments = this.getNewSchedule(loan, rescheduleDto);
        return installments;
    }

    @Override
    @Transactional
    public void reschedule(Loan loan, ManualEditRescheduleDto manualEditRescheduleDto, LocalTime timeEvent) {
        RescheduleDto rescheduleDto = manualEditRescheduleDto.getRescheduleDto();
        LocalDateTime effectiveAt = LocalDateTime.of(rescheduleDto.getRescheduleDate(), timeEvent);

        LoanInfo loanInfo = this.loanService.getLoanInfo(loan.getId(), effectiveAt.toLocalDate());

        ExtraJson oldValues = StorageLoanParameter.builder()
                .gracePeriod(loan.getGracePeriod())
                .interestRate(loan.getInterestRate())
                .maturity(loan.getMaturity())
                .maturityDate(loan.getMaturityDate())
                .build().toExtraJson();

        LoanEvent rescheduleEvent = createLoanRescheduleEvent(loan.getId(), effectiveAt, loanInfo.getOlb(), oldValues);

        List<LoanInstallment> rescheduledInstallment = this.getNewSchedule(loan, rescheduleDto);
        List<LoanInstallment> oldReschedule = this.loanInstallmentRepository.findByLoanIdAndDateTime(loan.getId(),
                LocalDateTime.of(rescheduleDto.getRescheduleDate(), DateHelper.getLocalTimeNow()));

        List<LoanInstallment> beforeReschedule = oldReschedule.stream()
                .map(loanInstallment -> {
                    LoanInstallment installment = new LoanInstallment(loanInstallment);
                    installment.setEventGroupKey(loanInstallment.getEventGroupKey());
                    installment.setEffectiveAt(loanInstallment.getEffectiveAt());
                    installment.setLoanId(loanInstallment.getLoanId());
                    return installment;
                })
                .collect(Collectors.toList());

        List<Integer> paidInstallmentNumbers = InstallmentsHelper.getPaidInstallments(beforeReschedule).stream()
                .map(LoanInstallment::getNumber)
                .collect(Collectors.toList());

        List<LoanInstallment> toSave = new ArrayList<>();
        rescheduledInstallment
                .stream()
                .filter(i -> !paidInstallmentNumbers.contains(i.getNumber()))
                .map(LoanInstallment::new)
                .forEach(i -> {
                    i.setEventGroupKey(rescheduleEvent.getGroupKey());
                    i.setEffectiveAt(effectiveAt);
                    i.setLoanId(loan.getId());
                    i.setRescheduled(false);
                    toSave.add(i);
                });

        List<Integer> rescheduledNumbers = rescheduledInstallment.stream()
                .map(LoanInstallment::getNumber)
                .collect(Collectors.toList());

        beforeReschedule.stream()
                .filter(i -> !rescheduledNumbers.contains(i.getNumber()))
                .forEach(installment -> {
                    installment.setEventGroupKey(rescheduleEvent.getGroupKey());
                    installment.setEffectiveAt(effectiveAt);
                    installment.setLoanId(loan.getId());
                    installment.setRescheduled(true);
                    toSave.add(installment);
                });

        loan.setInterestRate(rescheduleDto.getInterestRate());
        loan.setGracePeriod(rescheduleDto.getGracePeriod());
        loan.setMaturityDate(rescheduleDto.getMaturityDate());
        loan.setMaturity(rescheduleDto.getMaturity());

        updateInstalmentByManualFix(toSave, manualEditRescheduleDto.getScheduleDto());

        List<LoanInstallment> savedLoanInstallments = this.loanInstallmentRepository.save(toSave);

        this.moveAccruedInterest(savedLoanInstallments, rescheduleDto.getFirstInstallmentDate());

        loanAnalyticsProcess.processContract(loan.getId(), rescheduleDto.getRescheduleDate(), UserHelper.getCurrentUser());
    }

    private void updateInstalmentByManualFix(List<LoanInstallment> installments, ScheduleDto scheduleDto) {
        final List<Installment> manualInstallments = this.loanScheduleMapper.mapScheduleDtoToInstallments(scheduleDto);
        final List<LoanInstallment> unpaidInstallments = InstallmentsHelper.getUnpaidInstallments(installments);
        unpaidInstallments.forEach(ui->{
            for(Installment installment : manualInstallments) {
                if (installment.getNumber()==ui.getNumber()) {
                    ui.setOlb(installment.getOlb());
                    ui.setPrincipal(installment.getPrincipal());
                    ui.setInterest(installment.getInterest());
                    ui.setMaturityDate(installment.getMaturityDate());
                    ui.setLastAccrualDate(installment.getMaturityDate());
                }
            }
        });
    }

    public List<LoanInstallment> getNewSchedule(Loan loan, RescheduleDto rescheduleDto ) {
        LocalDateTime rescheduleDateTime = LocalDateTime.of(rescheduleDto.getRescheduleDate(), DateHelper.getLocalTimeNow());
        List<LoanInstallment> installments =
                this.detachedCopyInstallments(this.loanInstallmentRepository.findByLoanIdAndDateTime(loan.getId(), rescheduleDateTime));

        List<LoanInstallment> newScheduler = new ArrayList<>();
        LoanInfo loanInfo = this.loanService.getLoanInfo(loan.getId(), rescheduleDateTime.toLocalDate());

        List<LoanInstallment> oldPart = installments.stream()
                .filter(x->DateHelper.lessOrEqual(x.getMaturityDate(), rescheduleDateTime.toLocalDate()))
                .collect(Collectors.toList());

        newScheduler.addAll(this.restructureInstalments(oldPart, loanInfo));

        ScheduleParams scheduleParams = this.getScheduleParameter(loan, loanInfo, rescheduleDto);

        ModelMapper modelMapper = new ModelMapper();
        List<LoanInstallment> newPartSchedule = this.scheduleService.getSchedule(scheduleParams).stream()
                .map(x -> {
                    LoanInstallment loanInstallment = modelMapper.map(x, LoanInstallment.class);
                    loanInstallment.setAccruedInterest(BigDecimal.ZERO);
                    loanInstallment.setPaidPrincipal(BigDecimal.ZERO);
                    loanInstallment.setPaidInterest(BigDecimal.ZERO);
                    loanInstallment.setEffectiveAt(rescheduleDateTime);
                    return loanInstallment;
                })
                .collect(Collectors.toList());

        if (CollectionUtils.isEmpty(newPartSchedule)) {
            return newScheduler;
        }

        final LoanInstallment firstInstallment = newPartSchedule.get(0);
        //BigDecimal accruedInterest = loanInfo.getPaidInterest();//loanInfo.get Interest().subtract(loanInfo.getPaidInterest());
        //BigDecimal accruedInterest = loanInfo.getInterest().subtract(loanInfo.getPaidInterest());
        BigDecimal accruedInterest = loanInfo.getInterest();
        firstInstallment.setAccruedInterest(accruedInterest);
        firstInstallment.setInterest(firstInstallment.getInterest().add(accruedInterest));

        newScheduler.addAll(newPartSchedule);

        Integer number = 1;
        for (LoanInstallment loanInstallment: newScheduler ){
            loanInstallment.setNumber(number);
            number++;
        }
        return newScheduler;
    }

    private void moveAccruedInterest(List<LoanInstallment> installments, LocalDate targetMaturityDate) {
        List<Integer> installmentNumbers = installments.stream()
                .filter(i -> i.isPaid()
                        && BigDecimal.ZERO.compareTo(i.getAccruedInterest()) == 0
                        && BigDecimal.ZERO.compareTo(i.getPrincipal()) == 0
                        && DateHelper.less(i.getMaturityDate(), targetMaturityDate)
                )
                .map(LoanInstallment::getNumber)
                .collect(Collectors.toList());

        final Optional<LoanInstallment> targetInstallment = installments.stream()
                .filter(installment -> DateHelper.equal(installment.getMaturityDate(), targetMaturityDate))
                .findFirst();

        if (!targetInstallment.isPresent()) {
            log.info("Not found Target installment");
            return;
        }

        List<Long> eventIds =
                this.loanEventService.findAllByLoanIdAndDeletedAndEventType(targetInstallment.get().getLoanId(),false, EventType.ACCRUAL_OF_INTEREST).stream()
                .filter(loanEvent -> installmentNumbers.contains(loanEvent.getInstallmentNumber()))
                .map(LoanEvent::getId)
                .collect(Collectors.toList());
        this.loanEventService.moveEventsToInstallment( eventIds, targetInstallment.get());
    }

    private List<LoanInstallment> restructureInstalments(List<LoanInstallment> installments, LoanInfo loanInfo) {
        for (LoanInstallment loanInstallment: installments) {
            if (loanInstallment.isPaid()){
                continue;
            }

            loanInstallment.setInterest(loanInstallment.getPaidInterest());
            loanInstallment.setPrincipal(loanInstallment.getPaidPrincipal());
            loanInstallment.setOlb(loanInfo.getOlb());
            loanInstallment.setAccruedInterest(loanInstallment.getPaidInterest());
            loanInstallment.setLastAccrualDate(loanInstallment.getMaturityDate());
        }

        return installments;
    }

    private ScheduleParams getScheduleParameter(Loan loan, LoanInfo loanInfo, RescheduleDto rescheduleDto) {
        ScheduleParams scheduleParams = ScheduleParams.builder()
                .amount(loanInfo.getOlb())
                .interestRate(rescheduleDto.getInterestRate())
                .disbursementDate(rescheduleDto.getRescheduleDate())
                .gracePeriod(rescheduleDto.getGracePeriod())
                .preferredRepaymentDate(rescheduleDto.getFirstInstallmentDate())
                .maturity(rescheduleDto.getMaturity())
                .maturityDate(rescheduleDto.getMaturityDate())
                .scheduleType(rescheduleDto.getScheduleType())
                .scheduleBasedType(loan.getLoanApplication().getLoanProduct().getScheduleBasedType())
                .build();

        return scheduleParams;
    }

    private LoanEvent createLoanRescheduleEvent(Long loanId, LocalDateTime dateTime, BigDecimal amount, ExtraJson oldParamers
            //,Integer gracePeriod, BigDecimal interestRate, Integer maturity, LocalDate maturityDate
    ) {
        LoanEvent event = this.createRescheduleEvent(dateTime);
        event.setLoanId(loanId);
        event.setAmount(amount);
        event.setExtra(oldParamers);

        return this.loanEventService.saveWithoutAnalytic(event);
    }

    private LoanEvent createRescheduleEvent(LocalDateTime dateTime) {
        LoanEvent event = new LoanEvent();
        event.setEventType(EventType.RESCHEDULING);
        event.setCreatedAt(DateHelper.getLocalDateTimeNow());
        event.setCreatedById(UserHelper.getCurrentUser().getId());
        event.setEffectiveAt(dateTime);
        event.setGroupKey(this.eventGroupKeyService.getNextEventGroupKey());
        return event;
    }

    private List<LoanInstallment> detachedCopyInstallments(List<LoanInstallment> installments) {
        return installments.stream()
                .map(LoanInstallment::new)
                .collect(Collectors.toList());
    }
}
