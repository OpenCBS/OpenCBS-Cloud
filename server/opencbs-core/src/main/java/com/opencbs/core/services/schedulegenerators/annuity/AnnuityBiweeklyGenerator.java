package com.opencbs.core.services.schedulegenerators.annuity;

import com.opencbs.core.services.HolidayService;
import com.opencbs.core.services.schedulegenerators.AbstractAnnuityGenerator;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AnnuityBiweeklyGenerator extends AbstractAnnuityGenerator {

    private static final int DAYS_IN_PERIOD = 14;


    @Autowired
    protected AnnuityBiweeklyGenerator(@NonNull HolidayService holidayService) {
        super(holidayService, 0, DAYS_IN_PERIOD);
    }

    @Override
    public int getDaysInPeriod() {
        return DAYS_IN_PERIOD;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.ANNUITY_BIWEEKLY;
    }

    @Override
    protected int getDaysInYear() {
        return 360;
    }
}