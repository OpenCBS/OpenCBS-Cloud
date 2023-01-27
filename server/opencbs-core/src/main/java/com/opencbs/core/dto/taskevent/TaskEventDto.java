package com.opencbs.core.dto.taskevent;

import lombok.Data;

import java.util.List;

@Data
public class TaskEventDto extends TaskEventBaseDto {
    private List<TaskEventParticipantsDto> participants;
}
