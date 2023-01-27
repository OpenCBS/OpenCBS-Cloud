package com.opencbs.loans.workers;

import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.dto.ManualEditRescheduleDto;
import com.opencbs.core.dto.RescheduleDto;
import com.opencbs.core.helpers.ActualizeHelper;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.notificators.LoanNotificatorSender;
import com.opencbs.loans.services.ActualizeLoanStarterService;
import com.opencbs.loans.services.LoanEventService;
import com.opencbs.loans.services.loanreschedule.LoanRescheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class LoanRescheduleWorker {

    private static final String ROLLBACK_COMMENT = "Rollback by reschedule";
    private static final Integer OFFSET_MINUETS_AFTER_LAST_USER_EVENT = 1;

    private final LoanRollBackWorker loanRollBackWorker;
    private final ActualizeLoanStarterService actualizeLoanStarterService;
    private final LoanEventService loanEventService;
    private final LoanRescheduleService loanRescheduleService;
    private final LoanNotificatorSender loanNotificatorSender;


    public void makeReschedule(Loan loan, ManualEditRescheduleDto manualEditRescheduleDto) {
        RescheduleDto rescheduleDto = manualEditRescheduleDto.getRescheduleDto();

        Assert.isTrue(!this.loanEventService.isExistsRepaymentEventWasLateDate(loan.getId(), rescheduleDto.getRescheduleDate()), "Can't make reschedule because was repayment" );
        LocalDate lastActualizeDate = ActualizeHelper.getLastActualizeDate(loan.getId(), ModuleType.LOANS);

        LocalDateTime rescheduleDateTime =
                LocalDateTime.of(rescheduleDto.getRescheduleDate(), ProcessType.LOAN_INTEREST_ACCRUAL.getOperationTime() );
        LocalTime rescheduleTimeEvent = DateHelper.getLocalTimeNow();
        if (DateHelper.less(rescheduleDateTime, LocalDateTime.of(lastActualizeDate, ProcessType.LOAN_INTEREST_ACCRUAL.getOperationTime()))) {
            RollbackParams rollbackParam = RollbackParams.builder()
                    .dateTime(rescheduleDateTime.with(LocalTime.MAX))
                    .comment(ROLLBACK_COMMENT)
                    .build();
            this.loanRollBackWorker.rollBack(rollbackParam, loan.getId());

            // Set correct time for reschedule
            this.loanEventService.findMaxEventEffectiveAtByDate(loan.getId(), rescheduleDto.getRescheduleDate())
                    .ifPresent(localDateTime ->
                        rescheduleTimeEvent.with(localDateTime.plusMinutes(OFFSET_MINUETS_AFTER_LAST_USER_EVENT).toLocalTime())
            );
        }

        this.loanRescheduleService.reschedule(loan, manualEditRescheduleDto, rescheduleTimeEvent);
        this.loanNotificatorSender.senLoanReschedulerNotification(loan, rescheduleDto);
        this.actualizeLoanStarterService.actualizing(loan.getId(), lastActualizeDate, UserHelper.getCurrentUser());
    }
}
