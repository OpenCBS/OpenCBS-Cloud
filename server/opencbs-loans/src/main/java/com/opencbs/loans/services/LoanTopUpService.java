package com.opencbs.loans.services;

import com.opencbs.core.domain.BaseInstallment;
import com.opencbs.core.domain.EntryFee;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.EntryFeeService;
import com.opencbs.core.services.EventGroupKeyService;
import com.opencbs.core.services.schedulegenerators.ScheduleService;
import com.opencbs.loans.analytics.loan.domain.Analytic;
import com.opencbs.loans.analytics.loan.services.AnalyticsService;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanApplicationEntryFee;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanHistory;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.dto.LoanTopUpDto;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.repositories.LoanLoanHistoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import javax.script.ScriptException;
import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanTopUpService {

    private final AnalyticsService analyticsService;
    private final LoanAccountingService loanAccountingService;
    private final EntryFeeService entryFeeService;
    private final EventGroupKeyService eventGroupKeyService;
    private final LoanEventService loanEventService;
    private final LoanInstallmentRepository loanInstallmentRepository;
    private final ScheduleService scheduleService;
    private final LoanLoanHistoryRepository loanLoanHistoryRepository;
    private final LoanService loanService;

    public LoanTopUpService(AnalyticsService analyticsService,
                            LoanAccountingService loanAccountingService,
                            EntryFeeService entryFeeService,
                            EventGroupKeyService eventGroupKeyService,
                            LoanEventService loanEventService,
                            LoanInstallmentRepository loanInstallmentRepository,
                            ScheduleService scheduleService,
                            LoanLoanHistoryRepository loanLoanHistoryRepository,
                            LoanService loanService) {
        this.analyticsService = analyticsService;
        this.loanAccountingService = loanAccountingService;
        this.entryFeeService = entryFeeService;
        this.eventGroupKeyService = eventGroupKeyService;
        this.loanEventService = loanEventService;
        this.loanInstallmentRepository = loanInstallmentRepository;
        this.scheduleService = scheduleService;
        this.loanLoanHistoryRepository = loanLoanHistoryRepository;
        this.loanService = loanService;
    }

    @Transactional
    public void topUp(Loan loan, LoanTopUpDto dto, User currentUser) throws Exception {
        LoanEvent topUpEvent = this.createTopUpEventWithAccountingEntries(loan, dto, currentUser);
        this.createTopUpEntryFeesWithAccountingEntries(dto, loan, topUpEvent, currentUser);
        this.saveNewInstallments(loan, dto, topUpEvent);
        this.updateLoanEntity(loan, dto, topUpEvent);
    }

    private LoanEvent createTopUpEventWithAccountingEntries(Loan loan, LoanTopUpDto dto, User currentUser) {
        LoanEvent event = new LoanEvent();
        event.setLoanId(loan.getId());
        event.setAmount(dto.getAmount());
        event.setEventType(EventType.TOP_UP);
        event.setCreatedAt(DateHelper.getLocalDateTimeNow());
        event.setCreatedById(currentUser.getId());
        event.setEffectiveAt(LocalDateTime.of(dto.getDisbursementDate(), DateHelper.getLocalTimeNow()));
        event.setGroupKey(this.eventGroupKeyService.getNextEventGroupKey());
        LoanEvent topUpEvent = this.loanEventService.save(event);
        this.loanAccountingService.createTopUpAccountingEntry(topUpEvent);
        return topUpEvent;
    }

    private void createTopUpEntryFeesWithAccountingEntries(LoanTopUpDto dto, Loan loan, LoanEvent topUpEvent, User currentUser) {
        if(dto.getEntryFees() == null)
            return;

        List<LoanApplicationEntryFee> entryFees = dto.getEntryFees() == null ? new ArrayList<>() : dto.getEntryFees()
                .stream()
                .map(x -> {
                    LoanApplicationEntryFee loanApplicationEntryFee = new ModelMapper()
                            .map(x, LoanApplicationEntryFee.class);
                    EntryFee entryFee = this.entryFeeService.findOne(x.getEntryFeeId()).get();
                    loanApplicationEntryFee.setEntryFee(entryFee);
                    loanApplicationEntryFee.setId(null);
                    return loanApplicationEntryFee;
                })
                .collect(Collectors.toList());

        for (LoanApplicationEntryFee entryFee : entryFees) {
            LoanEvent entryFeeEvent = this.createEntryFeeTopUpEvent(currentUser, loan, entryFee.getAmount(), topUpEvent);
            this.loanAccountingService.createEntryFeeAccountingEntry(entryFeeEvent, loan,
                    entryFee.getEntryFee(), "Top up fee disbursement");
        }
    }

    private LoanEvent createEntryFeeTopUpEvent(User currentUser, Loan loan, BigDecimal amount, LoanEvent topUpEvent) {
        LoanEvent entryFeeEvent = new LoanEvent();
        entryFeeEvent.setAmount(amount);
        entryFeeEvent.setLoanId(loan.getId());
        entryFeeEvent.setEventType(EventType.TOP_UP_ENTRY_FEE);
        entryFeeEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        entryFeeEvent.setCreatedById(currentUser.getId());
        entryFeeEvent.setEffectiveAt(DateHelper.getLocalDateTimeNow());
        entryFeeEvent.setGroupKey(topUpEvent.getGroupKey());
        this.loanEventService.saveWithoutAnalytic(entryFeeEvent);
        return entryFeeEvent;
    }

    private void saveNewInstallments(Loan loan, LoanTopUpDto dto, LoanEvent topUpEvent) {
        LocalDate date = dto.getDisbursementDate();
        List<LoanInstallment> installments = this.loanInstallmentRepository.findByLoanIdAndDateTime(loan.getId(), null);
        installments.sort(Comparator.comparing(LoanInstallment::getNumber));
        List<LoanInstallment> result = installments
                .stream()
                .filter(x -> x.getMaturityDate().isBefore(dto.getDisbursementDate())
                        || x.getMaturityDate().isEqual(dto.getDisbursementDate()))
                .collect(Collectors.toList());

        LoanInstallment currentInstallment = installments
                .stream()
                .filter(x -> x.getMaturityDate().isEqual(dto.getDisbursementDate()))
                .findFirst()
                .orElse(null);

        LoanInstallment nextInstallment = currentInstallment == null
                              ? installments
                                .stream()
                                .filter(x -> DateHelper.greater(x.getMaturityDate(), date))
                                .findFirst()
                                .orElse(null)
                              : currentInstallment;
        if(nextInstallment == null) {
            return;
        }

        BigDecimal oldOlb = this.getOldOlb(dto, loan);

        Installment newInstallment = new Installment();
        newInstallment.setNumber(nextInstallment.getNumber());
        newInstallment.setMaturityDate(date);
        newInstallment.setLastAccrualDate(date);
        newInstallment.setOlb(oldOlb.add(dto.getAmount()));
        newInstallment.setPrincipal(BigDecimal.ZERO);
        newInstallment.setPaidPrincipal(BigDecimal.ZERO);
        newInstallment.setInterest(nextInstallment.getAccruedInterest());
        newInstallment.setPaidInterest(nextInstallment.getPaidInterest());

        ScheduleParams scheduleParameter = this.getScheduleParameter(loan, dto, oldOlb);
        List<Installment> generatedSchedule = new ArrayList<>();
        generatedSchedule.add(newInstallment);
        generatedSchedule.addAll(this.scheduleService.getSchedule(scheduleParameter));

        final int[] number = {result.stream().mapToInt(BaseInstallment::getNumber).max().orElse(0)};
        ModelMapper mapper = new ModelMapper();

        List<LoanInstallment> newSchedule = generatedSchedule
                .stream()
                .map((Installment x) -> {
                    LoanInstallment installment = mapper.map(x, LoanInstallment.class);
                    if(number[0] == 0) {
                        installment.setAccruedInterest(nextInstallment.getAccruedInterest());
                    }
                    number[0] += 1;
                    installment.setId(null);
                    installment.setLoanId(loan.getId());
                    installment.setNumber(number[0]);
                    installment.setPaidPrincipal(BigDecimal.ZERO);
                    installment.setPaidInterest(BigDecimal.ZERO);
                    installment.setAccruedInterest(BigDecimal.ZERO);
                    return installment;
                }).collect(Collectors.toList());

        result.addAll(newSchedule);
        result
            .forEach(x -> {
                x.setEffectiveAt(topUpEvent.getEffectiveAt());
                x.setEventGroupKey(topUpEvent.getGroupKey());
                x.setRescheduled(false);
            });

        this.loanInstallmentRepository.save(result);
    }

    private ScheduleParams getScheduleParameter(Loan loan, LoanTopUpDto dto, BigDecimal oldOlb) {
        ScheduleParams params = new ScheduleParams();
        params.setInterestRate(dto.getInterestRate());
        params.setDisbursementDate(dto.getDisbursementDate());
        params.setPreferredRepaymentDate(dto.getPreferredRepaymentDate());
        params.setScheduleType(loan.getLoanApplication().getScheduleType());
        params.setMaturity(dto.getMaturity());
        params.setGracePeriod(dto.getGracePeriod());
        BigDecimal amount = oldOlb.add(dto.getAmount());
        params.setAmount(amount);

        return params;
    }

    private BigDecimal getOldOlb(LoanTopUpDto dto, Loan loan) {
        Analytic calculatedAnalytic = this.analyticsService.getCalculatedAnalytic(
                loan.getId(), dto.getDisbursementDate());
        return calculatedAnalytic.getOlb();
    }

    private void updateLoanEntity(Loan loan, LoanTopUpDto dto, LoanEvent topUpEvent) throws ScriptException, ResourceNotFoundException {
        this.saveLoanHistory(loan, topUpEvent);

        loan.setAmount(loan.getAmount().add(dto.getAmount()));
        loan.setInterestRate(dto.getInterestRate());
        this.loanService.update(loan);
    }

    private void saveLoanHistory(Loan loan, LoanEvent topUpEvent) {
        LoanHistory loanHistory = new LoanHistory();
        loanHistory.setLoan(loan);
        loanHistory.setLoanEvent(topUpEvent);
        loanHistory.setAmount(loan.getAmount());
        loanHistory.setInterestRate(loan.getInterestRate());
        this.loanLoanHistoryRepository.save(loanHistory);
    }
}
