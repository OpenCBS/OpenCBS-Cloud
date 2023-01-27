package com.opencbs.core.domain;

import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.json.ExtraJson;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(exclude = {"groupKey"}, callSuper = false)

@MappedSuperclass
public abstract class BaseEvent extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "created_by_id", nullable = false)
    private Long createdById;

    @Column(name = "effective_at", nullable = false)
    private LocalDateTime effectiveAt;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    @Column(name = "installment_number")
    private Integer installmentNumber;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "group_key", nullable = false)
    private Long groupKey;

    @Column(name = "comment")
    private String comment;
    
    @Column(name = "system")
    private boolean system;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rolled_back_by_id")
    private User rolledBackBy;

    @Column(name = "rolled_back_date")
    private LocalDateTime rolledBackTime;

    @Type(type = "ExtraJsonType")
    @Column(name = "extra", columnDefinition = "jsonb")
    private ExtraJson extra;
}
