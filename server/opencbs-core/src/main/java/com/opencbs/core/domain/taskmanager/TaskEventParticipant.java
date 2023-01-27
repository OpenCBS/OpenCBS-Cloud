package com.opencbs.core.domain.taskmanager;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "task_events_participants")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "[type]", discriminatorType = DiscriminatorType.STRING)
public class TaskEventParticipant extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_events_id", nullable = false)
    private TaskEvent taskEvent;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;
}