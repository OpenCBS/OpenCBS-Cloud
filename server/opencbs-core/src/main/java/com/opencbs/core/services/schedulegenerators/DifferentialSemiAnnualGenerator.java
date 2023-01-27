package com.opencbs.core.services.schedulegenerators;

import com.opencbs.core.services.HolidayService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DifferentialSemiAnnualGenerator extends AbstractDifferentialGenerator {

    private static final int DAYS_IN_PERIOD = 30;


    @Autowired
    protected DifferentialSemiAnnualGenerator(@NonNull HolidayService holidayService) {
        super(holidayService, 6, 1);
    }

    @Override
    public int getDaysInPeriod() {
        return DAYS_IN_PERIOD;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.DIFFERENTIAL_SEMI_ANNUAL;
    }
}
