package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "loans_installments")
public class LoanInstallmentInterestAccrual extends BaseEntity {

    @Column(name = "loan_id")
    private Long loanId;

    @Column(name = "last_accrual_date")
    protected LocalDate lastAccrualDate;

    @Column(name = "number")
    protected Integer number;

    @Column(name = "paid_interest")
    protected BigDecimal paidInterest;

    @Column(name = "olb")
    protected BigDecimal olb;

    @Column(name = "interest")
    protected BigDecimal interest;

    @Column(name = "deleted", nullable = false)
    protected Boolean deleted = false;
}
