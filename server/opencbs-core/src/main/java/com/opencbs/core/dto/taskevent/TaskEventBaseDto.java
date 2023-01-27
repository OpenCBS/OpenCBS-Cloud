package com.opencbs.core.dto.taskevent;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskEventBaseDto extends BaseDto {

    private String title;

    private String description;

    private LocalDateTime start;

    private LocalDateTime end;

    private LocalDateTime notify;

    private boolean allDay;
}
