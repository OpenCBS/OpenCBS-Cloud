package com.opencbs.borrowings.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.enums.EventType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "borrowing_events")
public class BorrowingEventInterestAccrual extends BaseEntity {

    @Column(name = "borrowing_id")
    private Long borrowingId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type")
    private EventType eventType;

    @Column(name = "installment_number")
    private Integer installmentNumber;

    @Column(name = "amount")
    private BigDecimal amount;
}
