package com.opencbs.core.services.schedulegenerators;

import com.opencbs.core.domain.Holiday;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.HolidayService;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static com.opencbs.core.services.schedulegenerators.ScheduleGenerator.ROUNDING_MODE;

@RequiredArgsConstructor
public class ScheduleGeneratorHelper {

    private final HolidayService holidayService;


    public LocalDate getDate(LocalDate date, long number, int days) {
        List<Holiday> holidays = holidayService.findAll();
        return DateHelper.shiftDate(date.plusMonths(number).plusDays(days), holidays);
    }

    public BigDecimal getInterestRate(BigDecimal interest) {
        interest = interest.setScale(4, ROUNDING_MODE);
        interest = interest.divide(BigDecimal.valueOf(100), ROUNDING_MODE);
        return interest;
    }

    public LocalDate getShiftedDate(LocalDate date) {
        List<Holiday> holidays = this.holidayService.findAll();
        return DateHelper.shiftDate(date, holidays);
    }

    public Installment buildsBaseInstallment(Integer number) {
        Installment installment = new Installment();
        installment.setPrincipal(BigDecimal.ZERO);
        installment.setInterest(BigDecimal.ZERO);
        installment.setOlb(BigDecimal.ZERO);
        installment.setNumber(number+1);
        return installment;
    }
}
