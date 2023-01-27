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
public class AnnuitySemiannuallyFactGenerator extends AbstractAnnuityFactGenerator {

    private static final int daysInPeriod = 30;


    @Autowired
    protected AnnuitySemiannuallyFactGenerator(@NonNull HolidayService holidayService) {
        super(holidayService, 6);
    }

    @Override
    public int getDaysInPeriod() {
        return daysInPeriod;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.ANNUITY_SEMIANNUALLY_FACT;
    }

    @Override
    protected int getDaysInYear(LocalDate date) {
        return Year.of(date.getYear()).length();
    }
}
