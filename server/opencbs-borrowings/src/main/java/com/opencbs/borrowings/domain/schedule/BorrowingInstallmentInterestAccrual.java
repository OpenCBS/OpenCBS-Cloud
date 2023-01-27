package com.opencbs.borrowings.domain.schedule;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "borrowings_installments")
public class BorrowingInstallmentInterestAccrual extends BaseEntity {

    @Column(name = "borrowing_id")
    private Long borrowingId;

    @Column(name = "number")
    protected Integer number;

    @Column(name = "maturity_date")
    protected LocalDate maturityDate;

    @Column(name = "olb")
    protected BigDecimal olb;

    @Column(name = "effective_at")
    protected LocalDateTime effectiveAt;

    @Column(name = "deleted")
    protected Boolean deleted;

    @Column(name = "event_group_key")
    protected Long eventGroupKey;

    @Column(name = "last_accrual_date")
    protected LocalDate lastAccrualDate;

    @Column(name = "interest")
    protected BigDecimal interest;
}
