package com.opencbs.core.repositories.customs;

import com.opencbs.core.domain.taskmanager.TaskEventParticipantsEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskEventsParticipantsRepositoryCustom {
    List<TaskEventParticipantsEntity> findAllTaskEventParticipants(String query, Pageable pageable);
}
