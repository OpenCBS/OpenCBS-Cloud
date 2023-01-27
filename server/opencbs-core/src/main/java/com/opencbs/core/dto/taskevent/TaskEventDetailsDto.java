package com.opencbs.core.dto.taskevent;

import com.opencbs.core.dto.UserDetailsDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskEventDetailsDto extends TaskEventBaseDto{
    private LocalDateTime createdAt;
    private UserDetailsDto createdBy;
    private List<TaskEventParticipantsDetailsDto> taskEventParticipants;
}
