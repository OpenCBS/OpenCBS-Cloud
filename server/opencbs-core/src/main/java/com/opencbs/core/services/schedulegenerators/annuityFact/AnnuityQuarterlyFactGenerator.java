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
public class AnnuityQuarterlyFactGenerator extends AbstractAnnuityFactGenerator{

    private static final int daysInPeriod = 90;


    @Autowired
    protected AnnuityQuarterlyFactGenerator(@NonNull HolidayService holidayService) {
        super(holidayService, 3);
    }

    @Override
    public int getDaysInPeriod() {
        return daysInPeriod;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.ANNUITY_QUARTERLY_FACT;
    }

    @Override
    protected int getDaysInYear(LocalDate date) {
        return Year.of(date.getYear()).length();
    }

    @Override
    public Boolean getIfFact() {
        return false;
    }
}