package com.opencbs.core.domain.taskmanager;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Immutable
@Table(name = "view_task_event_participants")
public class TaskEventParticipantsEntity extends BaseEntity{

    @Column(name = "participant_id")
    private Long participantId;

    @Column(name = "name")
    private String name;

    @Column(name = "is_user")
    private boolean isUser;

}
