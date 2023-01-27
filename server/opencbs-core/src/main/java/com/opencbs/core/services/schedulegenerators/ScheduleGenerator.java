package com.opencbs.core.services.schedulegenerators;

import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;

import java.math.RoundingMode;
import java.util.List;

public interface ScheduleGenerator {
    RoundingMode ROUNDING_MODE = RoundingMode.HALF_EVEN;
    int DECIMAL_PLACE = 2;

    List<Installment> getSchedule(ScheduleParams params);

    int getDaysInPeriod();

    ScheduleGeneratorTypes getType();

    Boolean getIfFact();
}
