package com.opencbs.core.services.schedulegenerators.annuityFact;

import com.opencbs.core.services.HolidayService;
import com.opencbs.core.services.schedulegenerators.AbstractAnnuityFactGenerator;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Year;

@Component
public class AnnuityMonthlyFactGenerator extends AbstractAnnuityFactGenerator {

    private static final int DAYS_IN_PERIOD = 30;


    @Autowired
    protected AnnuityMonthlyFactGenerator(@NonNull HolidayService holidayService) {
        super(holidayService,  1);
    }

    @Override
    public int getDaysInPeriod() {
        return DAYS_IN_PERIOD;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.ANNUITY_MONTHLY_FACT;
    }

    @Override
    protected int getDaysInYear(LocalDate date) {
        return Year.of(date.getYear()).length();
    }
}