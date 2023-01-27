package com.opencbs.core.services.schedulegenerators.fixedPrincipal;

import com.opencbs.core.services.HolidayService;
import com.opencbs.core.services.schedulegenerators.AbstractFixedPrincipalGenerator;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FixedPrincipalSixAndInterestSix extends AbstractFixedPrincipalGenerator {

    private static final int DAYS_IN_PERIOD = 0;


    @Autowired
    protected FixedPrincipalSixAndInterestSix(@NonNull HolidayService holidayService) {
        super(holidayService, 6);
    }

    @Override
    public int getDaysInPeriod() {
        return DAYS_IN_PERIOD;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.FIXED_PRINCIPAL_BY_SIX_MONTH;
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