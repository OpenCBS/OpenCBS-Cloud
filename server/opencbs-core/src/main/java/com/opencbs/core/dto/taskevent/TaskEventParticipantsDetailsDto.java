package com.opencbs.core.dto.taskevent;

import lombok.Data;

@Data
public class TaskEventParticipantsDetailsDto extends TaskEventParticipantsDto {
    private String name;
    private boolean deleted;
}
