package com.opencbs.loans.workers;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.BaseInstallment;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.ActualizeHelper;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.EventGroupKeyService;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.domain.LoanPenaltyEvent;
import com.opencbs.loans.domain.enums.LoanStatus;
import com.opencbs.loans.dto.RepaymentResult;
import com.opencbs.loans.notificators.LoanNotificatorSender;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.services.*;
import com.opencbs.loans.services.repayment.LoanRepaymentService;
import com.opencbs.loans.services.repayment.LoanRepaymentServiceFactory;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanRepaymentWorker {

    private static final String ROLLBACK_COMMENT = "Rollback by late repayment";
    private static final Integer OFFSET_MINUETS_AFTER_LAST_USER_EVENT = 1;


    private final LoanRollBackWorker loanRollBackWorker;
    private final ActualizeLoanStarterService actualizeLoanStarterService;
    private final LoanService loanService;
    private final LoanRepaymentServiceFactory loanRepaymentServiceFactory;
    private final LoanInstallmentRepository loanInstallmentRepository;
    private final EventGroupKeyService eventGroupKeyService;
    private final LoanEventService loanEventService;
    private final LoanAccountingService loanAccountingService;
    private final LoanPenaltyEventService loanPenaltyEventService;
    private final ProvisionService  provisionService;
    private final LoanNotificatorSender loanNotificatorSender;


    public void makeRepayment(RepaymentSplit repaymentSplit) {
        Assert.isTrue(!this.loanEventService.isExistsRepaymentEventWasLateDate(repaymentSplit.getId(), repaymentSplit.getTimestamp().toLocalDate()), "Can't make repayment because was repayment" );
        Loan loan = this.loanService.getLoanById(repaymentSplit.getId());
        LocalDate lastActualizeDate = ActualizeHelper.getLastActualizeDate(loan.getId(), ModuleType.LOANS);

        if (DateHelper.less(repaymentSplit.getTimestamp(), LocalDateTime.of(lastActualizeDate, ProcessType.LOAN_INTEREST_ACCRUAL.getOperationTime()))) {
            RollbackParams rollbackParam = RollbackParams.builder()
                    .dateTime(repaymentSplit.getTimestamp().with(LocalTime.MAX))
                    .comment(ROLLBACK_COMMENT)
                    .build();
            this.loanRollBackWorker.rollBack(rollbackParam, loan.getId());

            // Set correct time for past repayment
            this.loanEventService.findMaxEventEffectiveAtByDate(loan.getId(), repaymentSplit.getTimestamp().toLocalDate())
                    .ifPresent(localDateTime -> repaymentSplit.setTimestamp(localDateTime.plusMinutes(OFFSET_MINUETS_AFTER_LAST_USER_EVENT)));
        }

        LoanRepaymentService loanRepaymentService = this.loanRepaymentServiceFactory.getLoanRepaymentService(repaymentSplit.getRepaymentType());
        this.doRepay(loan, loanRepaymentService, repaymentSplit);
        this.loanNotificatorSender.sendRepaymentEnteredNotifiction(loan, repaymentSplit);
        if (!repaymentSplit.isAutoRepayment()) {
            this.actualizeLoanStarterService.actualizing(loan.getId(), lastActualizeDate, UserHelper.getCurrentUser());
        }
    }

    private void doRepay(Loan loan, LoanRepaymentService repaymentService, RepaymentSplit repaymentSplit) {
        RepaymentResult result = repaymentService.repay(loan, repaymentSplit);
        result.setCurrentUser(UserHelper.getCurrentUser());
        result.setTimestamp(repaymentSplit.getTimestamp());

        LocalDateTime now = DateHelper.getLocalDateTimeNow();

        Long groupKey = this.eventGroupKeyService.getNextEventGroupKey();
        Long accrualGroupKey = this.eventGroupKeyService.getNextEventGroupKey(); // get groupKey for accruals that equals groupKey + 1

        List<LoanInstallment> toSave = new ArrayList<>();

        Integer effectiveNanoTime = DateHelper.getLocalTimeNow().getNano();
        LocalDateTime effectiveDateTimeWithNano = repaymentSplit.getTimestamp().withNano(effectiveNanoTime);

        if (result.getAffectedNumbers() != null) {
            result.getInstallments()
                    .stream()
                    .filter(i -> result.getAffectedNumbers().contains(i.getNumber()))
                    .map(LoanInstallment::new)
                    .forEach(i -> {
                        i.setEventGroupKey(groupKey);
                        i.setEffectiveAt(effectiveDateTimeWithNano);
                        i.setLoanId(loan.getId());
                        i.setRescheduled(false);
                        toSave.add(i);
                    });
            this.loanInstallmentRepository.save(toSave);
        }

        saveLoanEvents(result.getEvents(), now, result, groupKey, accrualGroupKey);

        // Check if the loan is fully repaid and if yes then generates the closing event
        boolean loanRepaid = result.getInstallments()
                .parallelStream()
                .allMatch(BaseInstallment::isPaid);
        if (loanRepaid && repaymentService.isNeedClose()) { // isNeedClose if we can't close loan by rule from repayment politic
            this.saveCloseEvent(now, result, this.eventGroupKeyService.getNextEventGroupKey());
        }

        this.provisionService.createReserveByLoanId(loan.getId(), repaymentSplit.getTimestamp());
    }

    private void saveLoanEvents(List<LoanEvent> loanEvents, LocalDateTime dateTime, RepaymentResult result, Long groupKey, Long accrualGroupKey) {
        for (LoanEvent loanEvent : loanEvents) {
            if (loanEvent.getEventType().equals(EventType.ACCRUAL_OF_INTEREST) || loanEvent.getEventType().equals(EventType.ACCRUAL_OF_PENALTY)) {
                loanEvent.setGroupKey(accrualGroupKey);
            } else {
                loanEvent.setGroupKey(groupKey);
            }

            List<AccountingEntry> entries = new ArrayList<>(loanEvent.getAccountingEntry());
            loanEvent.setAccountingEntry(new ArrayList<>());

            loanEvent.setCreatedAt(dateTime);
            loanEvent.setCreatedById(result.getCurrentUser().getId());
            loanEvent.setEffectiveAt(result.getTimestamp());
            loanEvent.setLoanId(result.getLoan().getId());
            this.loanEventService.save(loanEvent);

            saveLoanPenaltyRepaymentEvent(loanEvent, entries, result);

            this.loanAccountingService.createLoanEventAccountingEntries(
                    entries,
                    result.getCurrentUser(),
                    result.getTimestamp(),
                    loanEvent
            );
        }
    }

    private void saveLoanPenaltyRepaymentEvent(LoanEvent loanEvent, List<AccountingEntry> entries, RepaymentResult result) {
        if (!loanEvent.getEventType().equals(EventType.REPAYMENT_OF_PENALTY)){
            return;
        }

        ModelMapper modelMapper = new ModelMapper();
        LoanPenaltyEvent loanPenaltyEvent = modelMapper.map(loanEvent, LoanPenaltyEvent.class);
        loanPenaltyEvent.setLoanApplicationPenaltyId(loanEvent.getLoanApplicationPenaltyId());
        LoanPenaltyEvent event = this.loanPenaltyEventService.save(loanPenaltyEvent);
        this.loanAccountingService.createLoanPenaltyEventAccountingEntries(entries, result.getCurrentUser(), result.getTimestamp(), event);
    }

    private void saveCloseEvent(LocalDateTime dateTime, RepaymentResult result, Long groupKey) {
        LoanEvent closingEvent = new LoanEvent();
        closingEvent.setEventType(EventType.CLOSED);
        closingEvent.setCreatedAt(dateTime);
        closingEvent.setCreatedById(result.getCurrentUser().getId());
        closingEvent.setEffectiveAt(result.getTimestamp());
        closingEvent.setGroupKey(groupKey);
        closingEvent.setLoanId(result.getLoan().getId());
        closingEvent.setAmount(BigDecimal.ZERO);
        result.getLoan().setStatus(LoanStatus.CLOSED);

        loanEventService.save(closingEvent);
    }
}
