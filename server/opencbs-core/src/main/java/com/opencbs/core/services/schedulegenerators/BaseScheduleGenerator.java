package com.opencbs.core.services.schedulegenerators;

import com.opencbs.core.domain.Holiday;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.HolidayService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public abstract class BaseScheduleGenerator implements ScheduleGenerator {

    private final HolidayService holidayService;


    private LocalDate getDate(LocalDate date, long number, int days) {
        List<Holiday> holidays = holidayService.findAll();
        return DateHelper.shiftDate(date.plusMonths(number).plusDays(days), holidays);
    }

    int getDays(LocalDate start, LocalDate end, boolean isFact) {
        int count = 0;
        start = start.plusDays(1);
        while (start.isBefore(end.plusDays(1))) {
            LocalDate date = start;
            start = start.plusDays(1);

            if (date.getMonth() == Month.FEBRUARY && !isFact) {
                if (date.getDayOfMonth() == 28 && !date.isLeapYear()) {
                    count += 3;
                } else if (date.getDayOfMonth() == 29 && date.isLeapYear()) {
                    count += 2;
                } else count++;
                continue;
            }

            if (date.getDayOfMonth() == 31 && !isFact) continue;
            count++;
        }

        return count;
    }

    private Installment buildsInstallment(@NonNull Integer number) {
        return Installment.builder()
                .number(number + 1)
                .principal(BigDecimal.ZERO)
                .interest(BigDecimal.ZERO)
                .paidPrincipal(BigDecimal.ZERO)
                .paidInterest(BigDecimal.ZERO)
                .olb(BigDecimal.ZERO)
                .build();
    }

    List<Installment> buildSchedule(ScheduleParams params, long period, long days) {
        List<Installment> installments = new ArrayList<>();
        LocalDate date = params.getDisbursementDate();
        int number = 0;

        while (DateHelper.lessOrEqual(date, params.getMaturityDate())) {
            Installment installment = buildsInstallment(number);

            LocalDate maturityDate = (number == 0)
                    ? params.getPreferredRepaymentDate()
                    : this.getDate(params.getPreferredRepaymentDate(), number * period, (int) (number * days));
            LocalDate lastAccrualDate = (number == 0)
                    ? params.getPreferredRepaymentDate()
                    : params.getPreferredRepaymentDate().plusMonths(number * period).plusDays(number * days);

            installment.setMaturityDate(maturityDate);
            installment.setLastAccrualDate(lastAccrualDate);
            installments.add(installment);

            date = maturityDate.plus(period, ChronoUnit.MONTHS);

            number ++;
        }

        if (DateHelper.less(installments.get(number - 1).getMaturityDate(), params.getMaturityDate())) {
            Installment installment = buildsInstallment(number);
            installment.setMaturityDate(params.getMaturityDate());
            installment.setLastAccrualDate(params.getMaturityDate());
            installments.add(installment);
        }

        return installments;
    }

    List<Installment> initRowSchedule(ScheduleParams params, long period, int days, boolean isFact) {
        List<Installment> installments = new ArrayList<>();
        for (int i = 0; i < params.getMaturity(); i++) {
            Installment installment = new Installment();
            installment.setNumber(i+1);
            LocalDate lastAccrualDate = i == 0 ?
                    params.getPreferredRepaymentDate()
                    : params.getPreferredRepaymentDate().plusMonths(i * period).plusDays(i * days);
            LocalDate maturityDate = i == 0 ?
                    params.getPreferredRepaymentDate()
                    : this.getDate(params.getPreferredRepaymentDate(), i * period, i * days);
            installment.setMaturityDate(maturityDate);

            if (isFact) {
                installment.setLastAccrualDate(maturityDate);
            } else {
                installment.setLastAccrualDate(lastAccrualDate);
            }

            installment.setPrincipal(BigDecimal.ZERO);
            installment.setInterest(BigDecimal.ZERO);
            installment.setOlb(BigDecimal.ZERO);
            installments.add(installment);
        }

        return installments;
    }

    protected List<Installment> initRowSchedule(ScheduleParams params, long period, boolean isFact) {
        return initRowSchedule(params, period, 0, isFact);
    }

    protected BigDecimal getInterestRate(BigDecimal interest) {
        return interest.setScale(4, ROUNDING_MODE).divide(BigDecimal.valueOf(100), ROUNDING_MODE);
    }
}
