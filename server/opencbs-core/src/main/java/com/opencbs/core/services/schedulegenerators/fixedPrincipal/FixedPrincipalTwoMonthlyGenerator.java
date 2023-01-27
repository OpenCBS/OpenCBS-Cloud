package com.opencbs.core.services.schedulegenerators.fixedPrincipal;

import com.opencbs.core.services.HolidayService;
import com.opencbs.core.services.schedulegenerators.AbstractFixedPrincipalGenerator;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FixedPrincipalTwoMonthlyGenerator extends AbstractFixedPrincipalGenerator {

    private static final int DAYS_IN_PERIOD = 60;


    @Autowired
    protected FixedPrincipalTwoMonthlyGenerator(@NonNull HolidayService holidayService) {
        super(holidayService, 2);
    }

    @Override
    protected int getDaysInYear(int year) {
        return 360;
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
        return ScheduleGeneratorTypes.FIXED_PRINCIPAL_TWO_MONTHLY;
    }
}
