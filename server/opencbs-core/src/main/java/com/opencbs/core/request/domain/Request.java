package com.opencbs.core.request.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.domain.json.ExtraJsonType;
import lombok.Data;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "request")
@TypeDef(name = "ExtraJsonType", typeClass = ExtraJsonType.class)
public class Request extends BaseEntity {

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestType type;

    @ManyToOne
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "deleted_by_id")
    private User deletedBy;

    @ManyToOne
    @JoinColumn(name = "approved_by_id")
    private User approvedBy;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "expire_date", nullable = false)
    private LocalDate expireDate;

    @Type(type = "ExtraJsonType")
    @Column(name = "content", columnDefinition = "jsonb")
    private ExtraJson content;

    @Column(name = "deleted", nullable = false)
    private boolean deleted;

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "module_type")
    @Enumerated(EnumType.STRING)
    private ModuleType moduleType;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
}
