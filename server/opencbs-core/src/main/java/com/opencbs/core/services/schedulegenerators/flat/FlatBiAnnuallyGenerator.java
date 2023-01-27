package com.opencbs.core.services.schedulegenerators.flat;

import com.opencbs.core.services.HolidayService;
import com.opencbs.core.services.schedulegenerators.AbstractFlatGenerator;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FlatBiAnnuallyGenerator extends AbstractFlatGenerator {

    private static final int DAYS_IN_PERIOD = 180;
    private static final int DAYS_IN_YEAR = 360;


    @Autowired
    protected FlatBiAnnuallyGenerator(@NonNull HolidayService holidayService) {
        super(holidayService, 6, DAYS_IN_YEAR);
    }

    @Override
    public int getDaysInPeriod() {
        return DAYS_IN_PERIOD;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.FLAT_BI_ANNUALLY;
    }

    public int getDaysInYear() {
        return DAYS_IN_YEAR;
    }

    @Override
    public Boolean getIfFact() {
        return false;
    }
}
