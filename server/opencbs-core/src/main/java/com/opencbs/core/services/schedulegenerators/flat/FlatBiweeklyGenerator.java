package com.opencbs.core.services.schedulegenerators.flat;

import com.opencbs.core.services.HolidayService;
import com.opencbs.core.services.schedulegenerators.AbstractFlatGenerator;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FlatBiweeklyGenerator extends AbstractFlatGenerator {

    private static final int DAYS_IN_PERIOD = 14;
    private static final int DAYS_IN_YEAR = 336;


    @Autowired
    protected FlatBiweeklyGenerator(@NonNull HolidayService holidayService) {
        super(holidayService, 0, DAYS_IN_PERIOD, DAYS_IN_YEAR);
    }

    @Override
    public int getDaysInPeriod() {
        return DAYS_IN_PERIOD;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.FLAT_BIWEEKLY;
    }

    public int getDaysInYear() {
        return DAYS_IN_YEAR;
    }

    ///TODO Check count of days
    @Override
    public Boolean getIfFact() {
        return false;
    }
}