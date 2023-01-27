package com.opencbs.core.services.schedulegenerators;

import com.opencbs.core.services.HolidayService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DifferentialQuarterlyGenerator extends AbstractDifferentialGenerator {

    private static final int daysInPeriod = 90;


    @Autowired
    protected DifferentialQuarterlyGenerator(@NonNull HolidayService holidayService) {
        super(holidayService, 3, 1);
    }

    @Override
    public int getDaysInPeriod() {
        return daysInPeriod;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.DIFFERENTIAL_QUARTERLY;
    }
}
