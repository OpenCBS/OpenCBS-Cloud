package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseInstallment;
import com.opencbs.core.domain.types.InstallmentStatus;
import com.opencbs.core.domain.types.OverdueType;
import com.opencbs.core.helpers.NumericHelper;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

import static com.opencbs.core.domain.types.OverdueType.NOT_OVERDUE;
import static com.opencbs.core.domain.types.OverdueType.OVERDUE;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "loans_installments")
public class LoanInstallment extends BaseInstallment {

    @Column(name = "loan_id", nullable = false)
    private Long loanId;

    @Column(name = "start_date", nullable = false, insertable = false, updatable = false)
    protected LocalDate startDate;

    @Column(name = "accrual_start_date", nullable = false, insertable = false, updatable = false)
    protected LocalDate accrualStartDate;

    @Column(name = "accrued_interest", precision = 12, scale = 2, insertable = false, updatable = false)
    protected BigDecimal accruedInterest;

    @Column(name = "penalty", precision = 12, scale = 2, insertable = false, updatable = false)
    protected BigDecimal penalty;

    @Column(name = "paid_penalty", precision = 12, scale = 2, insertable = false, updatable = false)
    protected BigDecimal paidPenalty;


    public LoanInstallment() {
        this.penalty = BigDecimal.ZERO;
        this.paidPenalty = BigDecimal.ZERO;
    }

    public LoanInstallment(LoanInstallment copy) {
        super(copy);
        this.loanId = copy.loanId;
        this.penalty = copy.penalty;
        this.paidPenalty = copy.paidPenalty;
        this.accrualStartDate = copy.accrualStartDate;
        this.accruedInterest = copy.accruedInterest;
        this.startDate = copy.startDate;
    }

    @Override
    public BigDecimal getTotalDue() {
        return principal
                .subtract(paidPrincipal)
                .add((BigDecimal.ZERO.compareTo(accruedInterest)==0)
                        ?interest:accruedInterest)
                .subtract(paidInterest);
    }

    @Override
    public BigDecimal getTotalPaid() {
        return paidPrincipal.add(paidInterest);
    }

    public BigDecimal getInterestDueFromAccrual() {
        return getPaidInterest().compareTo(getAccruedInterest()) > 0
                ? BigDecimal.ZERO
                : getAccruedInterest().subtract(getPaidInterest());
    }

    public BigDecimal getPenaltyDue() {
        return NumericHelper.getBigDecimalFromNull(penalty).subtract(NumericHelper.getBigDecimalFromNull(paidPenalty));
    }

    public InstallmentStatus getStatus(){
        if (isPaid()) {
            return InstallmentStatus.PAID;
        } else if (isPartiallyPaid()) {
            return InstallmentStatus.PARTIALLY_PAID;
        }
        return InstallmentStatus.UNPAID;
    }

    public OverdueType getOverdue(LocalDate localDate){
        if (isOverdue(localDate)) {
            return OVERDUE;
        }

        return NOT_OVERDUE;
    }

}
