package com.opencbs.core.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor

@MappedSuperclass
public abstract class BaseInstallment extends BaseEntity {

    @Column(name = "deleted", nullable = false)
    protected Boolean deleted = false;

    @Column(name = "number", nullable = false)
    protected Integer number;

    @Column(name = "maturity_date", nullable = false)
    protected LocalDate maturityDate;

    @Column(name = "last_accrual_date", nullable = false)
    protected LocalDate lastAccrualDate;

    @Column(name = "principal", precision = 12, scale = 2, nullable = false)
    protected BigDecimal principal;

    @Column(name = "paid_principal", precision = 12, scale = 2, nullable = false)
    protected BigDecimal paidPrincipal;

    @Column(name = "interest", precision = 12, scale = 2, nullable = false)
    protected BigDecimal interest;

    @Column(name = "paid_interest", precision = 12, scale = 2, nullable = false)
    protected BigDecimal paidInterest;

    @Column(name = "olb", precision = 12, scale = 2, nullable = false)
    protected BigDecimal olb;

    @Column(name = "effective_at", nullable = false)
    protected LocalDateTime effectiveAt;

    @Column(name = "event_group_key", nullable = false)
    protected Long eventGroupKey;

    @Column(name = "rescheduled")
    protected Boolean rescheduled;


    public BaseInstallment(@NonNull BaseInstallment copy) {
        this.number = copy.number;
        this.maturityDate = copy.maturityDate;
        this.lastAccrualDate = copy.lastAccrualDate;
        this.principal = copy.principal;
        this.paidPrincipal = copy.paidPrincipal;
        this.interest = copy.interest;
        this.paidInterest = copy.paidInterest;
        this.olb = copy.olb;
    }

    public BigDecimal getTotalDue() {
        return principal
                .subtract(paidPrincipal)
                .add(interest)
                .subtract(paidInterest);
    }

    public BigDecimal getTotalPaid() {
        return paidPrincipal.add(paidInterest);
    }

    public BigDecimal getPrincipalDue() {
        return principal.subtract(paidPrincipal);
    }

    public BigDecimal getInterestDue() {
        return interest.subtract(paidInterest);
    }

    public boolean isPaid() {
        return getTotalDue().compareTo(BigDecimal.ZERO) <= 0;
    }

    public boolean isPartiallyPaid() {
        return getTotalPaid().compareTo(BigDecimal.ZERO) > 0 && !this.isPaid();
    }

    public boolean isBeforeOrEqualToDate(LocalDate date) {
        return maturityDate.compareTo(date) <= 0;
    }

    public boolean isBeforeDate(LocalDateTime timestamp) {
        return maturityDate.compareTo(timestamp.toLocalDate()) < 0;
    }

    public boolean isAfter(LocalDateTime timestamp) {
        return maturityDate.compareTo(timestamp.toLocalDate()) > 0;
    }

    public boolean isOverdue(LocalDate date) {
        return !isPaid() && maturityDate.compareTo(date) <= 0;
    }

    public void addInterest(BigDecimal interest){
        this.interest = this.getInterest().add(interest);
    }

}
