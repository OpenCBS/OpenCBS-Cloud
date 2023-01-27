package com.opencbs.core.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class ManualEditRescheduleDto {
    private RescheduleDto rescheduleDto;
    private ScheduleDto scheduleDto;
}
