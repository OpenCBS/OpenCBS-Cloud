package com.opencbs.core.domain;

import com.opencbs.core.domain.enums.EventType;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payees_events")
public class PayeeEvent extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @Column(name = "loan_applications_payee_id", nullable = false)
    private Long loanApplicationPayeeId;

    @Column(name = "effective_at", nullable = false)
    private LocalDateTime effectiveAt;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "group_key", nullable = false)
    private Long groupKey;

    @Column(name = "check_number")
    private String checkNumber;

    @Column(name = "description")
    private String description;

    @Column(name = "system")
    private boolean system;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rolled_back_by_id")
    private User rolledBackBy;

    @Column(name = "rolled_back_date")
    private LocalDateTime rolledBackTime;
}
