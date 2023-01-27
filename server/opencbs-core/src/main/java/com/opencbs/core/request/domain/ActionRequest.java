package com.opencbs.core.request.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.User;
import lombok.Data;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.time.LocalDateTime;


@Data
@Entity
@Immutable
@Table(name = "request")
public class ActionRequest extends BaseEntity {

    @Column(name = "approved_at")
    private LocalDateTime actionAt;

    @ManyToOne
    @JoinColumn(name = "approved_by_id")
    private User approvedBy;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestType requestType;

    @Transient
    private RequestActionType requestActionType;
}
