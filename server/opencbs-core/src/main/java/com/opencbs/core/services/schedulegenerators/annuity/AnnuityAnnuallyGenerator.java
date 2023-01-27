package com.opencbs.core.services.schedulegenerators.annuity;

import com.opencbs.core.services.HolidayService;
import com.opencbs.core.services.schedulegenerators.AbstractAnnuityGenerator;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AnnuityAnnuallyGenerator extends AbstractAnnuityGenerator {

    private static final int DAYS_IN_PERIOD = 360;
    private static final int DAYS_IN_YEAR = 360;


    @Autowired
    protected AnnuityAnnuallyGenerator(@NonNull HolidayService holidayService) {
        super(holidayService,  12);
    }

    @Override
    protected int getDaysInYear() {
        return DAYS_IN_YEAR;
    }

    @Override
    public int getDaysInPeriod() {
        return DAYS_IN_PERIOD;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.ANNUITY_ANNUAL;
    }
}
