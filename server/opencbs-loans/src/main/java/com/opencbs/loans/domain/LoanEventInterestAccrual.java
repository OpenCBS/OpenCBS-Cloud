package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.OtherFee;
import com.opencbs.core.domain.enums.EventType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Where;

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
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "loans_events")
@Where(clause = "deleted=false")
public class LoanEventInterestAccrual extends BaseEntity {

    @Column(name = "loan_id")
    private Long loanId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type")
    private EventType eventType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "other_fee_id")
    private OtherFee otherFee;

    @Column(name = "effective_at")
    private LocalDateTime effectiveAt;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "installment_number")
    private Integer installmentNumber;
}
