package com.opencbs.loans.credit.lines.domain;

import com.opencbs.core.domain.NamedBaseEntity;
import com.opencbs.core.domain.NamedEntity;
import com.opencbs.core.domain.Penalty;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.loans.domain.enums.EarlyRepaymentFeeType;
import com.opencbs.loans.domain.products.LoanProduct;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
@Entity
@Table(name = "credit_lines")
public class CreditLine extends NamedBaseEntity implements NamedEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "last_disbursement_date")
    private LocalDate lastDisbursementDate;

    @Column(name = "maturity_date", nullable = false)
    private LocalDate maturityDate;

    @Column(name = "committed_amount", nullable = false)
    private BigDecimal committedAmount;

    @Column(name = "disbursement_amount_min", nullable = false)
    private BigDecimal disbursementAmountMin;

    @Column(name = "disbursement_amount_max", nullable = false)
    private BigDecimal disbursementAmountMax;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_product_id", nullable = false)
    private LoanProduct loanProduct;

    @Column(name = "interest_rate_min", nullable = false)
    private BigDecimal interestRateMin;

    @Column(name = "interest_rate_max", nullable = false)
    private BigDecimal interestRateMax;

    @Column(name = "structuring_fees", nullable = false)
    private BigDecimal structuringFees;

    @Column(name = "entry_fees", nullable = false)
    private BigDecimal entryFees;

    @ManyToMany
    @JoinTable(
            name = "credit_lines_penalties",
            joinColumns = @JoinColumn(name = "credit_line_id"),
            inverseJoinColumns = @JoinColumn(name = "penalty_id")
    )
    private Set<Penalty> penalties;

    @Enumerated(EnumType.STRING)
    @Column(name = "early_partial_repayment_fee_type", nullable = false)
    private EarlyRepaymentFeeType earlyPartialRepaymentFeeType;

    @Column(name = "early_partial_repayment_fee_value", nullable = false)
    private BigDecimal earlyPartialRepaymentFeeValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "early_total_repayment_fee_type", nullable = false)
    private EarlyRepaymentFeeType earlyTotalRepaymentFeeType;

    @Column(name = "early_total_repayment_fee_value", nullable = false)
    private BigDecimal earlyTotalRepaymentFeeValue;
}
