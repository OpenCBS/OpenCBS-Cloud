package com.opencbs.core.domain.taskmanager;

import com.opencbs.core.domain.User;
import lombok.Data;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@Data
@DiscriminatorValue("User")
public class UserTaskEventParticipant extends TaskEventParticipant {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reference_id", nullable = false)
    private User user;
}
