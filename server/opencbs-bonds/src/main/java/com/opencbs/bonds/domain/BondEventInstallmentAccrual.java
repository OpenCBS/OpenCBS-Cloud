package com.opencbs.bonds.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.enums.EventType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "bonds_events")
public class BondEventInstallmentAccrual extends BaseEntity {

    @Column(name = "bond_id")
    private Long bondId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type")
    private EventType eventType;

    @Column(name = "effective_at")
    private LocalDateTime effectiveAt;

    @Column(name = "installment_number")
    private Integer installmentNumber;

    @Column(name = "amount")
    private BigDecimal amount;
}
