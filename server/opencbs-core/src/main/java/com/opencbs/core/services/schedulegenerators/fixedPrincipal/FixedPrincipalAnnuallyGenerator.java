package com.opencbs.core.services.schedulegenerators.fixedPrincipal;

import com.opencbs.core.services.HolidayService;
import com.opencbs.core.services.schedulegenerators.AbstractFixedPrincipalGenerator;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FixedPrincipalAnnuallyGenerator extends AbstractFixedPrincipalGenerator {

    private static final int DAYS_IN_PERIOD = 0;
    private static final int DAYS_IN_YEAR = 360;


    @Autowired
    protected FixedPrincipalAnnuallyGenerator(@NonNull HolidayService holidayService) {
        super(holidayService, 12 );
    }

    @Override
    protected int getDaysInYear(int year) {
        return DAYS_IN_YEAR;
    }

    @Override
    public Boolean getIfFact() {
        return false;
    }

    @Override
    public int getDaysInPeriod() {
        return DAYS_IN_PERIOD;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.FIXED_PRINCIPAL_ANNUAL;
    }
}
