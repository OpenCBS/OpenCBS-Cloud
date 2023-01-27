package com.opencbs.core.domain.taskmanager;

import com.opencbs.core.domain.profiles.Profile;
import lombok.Data;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@Data
@DiscriminatorValue("Profile")
public class ProfileTaskEventParticipant extends TaskEventParticipant {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reference_id", nullable = false)
    private Profile profile;
}
