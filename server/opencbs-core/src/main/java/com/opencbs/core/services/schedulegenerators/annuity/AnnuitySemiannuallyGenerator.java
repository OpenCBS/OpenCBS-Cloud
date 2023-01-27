package com.opencbs.core.services.schedulegenerators.annuity;

import com.opencbs.core.services.HolidayService;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.NonNull;
import com.opencbs.core.services.schedulegenerators.AbstractAnnuityGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AnnuitySemiannuallyGenerator extends AbstractAnnuityGenerator {

    private static final int DAYS_IN_PERIOD = 180;


    @Autowired
    protected AnnuitySemiannuallyGenerator(@NonNull HolidayService holidayService) {
        super(holidayService, 6);
    }

    @Override
    public int getDaysInPeriod() {
        return DAYS_IN_PERIOD;
    }

    @Override
    public ScheduleGeneratorTypes getType() {
        return ScheduleGeneratorTypes.ANNUITY_SEMIANNUALLY;
    }

    @Override
    protected int getDaysInYear() {
        return 360;
    }
}
