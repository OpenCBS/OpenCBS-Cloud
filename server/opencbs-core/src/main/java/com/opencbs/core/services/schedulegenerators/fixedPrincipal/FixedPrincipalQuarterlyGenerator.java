package com.opencbs.core.services.schedulegenerators.fixedPrincipal;

import com.opencbs.core.services.HolidayService;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.NonNull;
import com.opencbs.core.services.schedulegenerators.AbstractFixedPrincipalGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Year;

@Component
public class FixedPrincipalQuarterlyGenerator extends AbstractFixedPrincipalGenerator {

    private static final int DAYS_IN_PERIOD = 0;


    @Autowired
    protected FixedPrincipalQuarterlyGenerator(@NonNull HolidayService holidayService) {
        super(holidayService, 3);
    }

    @Override
    public int getDaysInPeriod() {
        return DAYS_IN_PERIOD;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.FIXED_PRINCIPAL_QUARTERLY;
    }

    @Override
    protected int getDaysInYear(int year) {
        return 360;
    }

    @Override
    public Boolean getIfFact() {
        return false;
    }
}

