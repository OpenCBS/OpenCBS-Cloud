package com.opencbs.core.services.schedulegenerators.flat;

import com.opencbs.core.services.HolidayService;
import com.opencbs.core.services.schedulegenerators.AbstractFlatGenerator;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FlatQuarterlyGenerator extends AbstractFlatGenerator {

    private static final int DAYS_IN_PERIOD = 90;
    private static final int DAYS_IN_YEAR = 360;


    @Autowired
    protected FlatQuarterlyGenerator(@NonNull HolidayService holidayService) {
        super(holidayService, 3, DAYS_IN_YEAR);
    }

    @Override
    public int getDaysInPeriod() {
        return DAYS_IN_PERIOD;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.FLAT_QUARTERLY;
    }

    public int getDaysInYear() {
        return DAYS_IN_YEAR;
    }

    @Override
    public Boolean getIfFact() {
        return false;
    }
}
