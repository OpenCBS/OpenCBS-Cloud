package com.opencbs.loans.domain.products;

import com.opencbs.core.domain.BaseProduct;
import com.opencbs.core.domain.EntryFee;
import com.opencbs.core.domain.NamedEntity;
import com.opencbs.core.domain.Penalty;
import com.opencbs.core.domain.enums.ScheduleBasedType;
import com.opencbs.loans.domain.LoanProductProvision;
import com.opencbs.loans.domain.enums.EarlyRepaymentFeeType;
import lombok.Data;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import static org.hibernate.envers.RelationTargetAuditMode.NOT_AUDITED;

@Data
@Audited
@AuditOverride(forClass = BaseProduct.class, isAudited = true)
@Entity
@Table(name = "loan_products")
public class LoanProduct extends BaseProduct implements NamedEntity {

    @Column(name = "availability", nullable = false)
    private int availability;

    @Column(name = "has_payees", nullable = false)
    private boolean hasPayees;

    @Column(name = "top_up_allow", nullable = false)
    private boolean topUpAllow;

    @Column(name = "top_up_max_limit")
    private BigDecimal topUpMaxLimit;

    @Column(name = "top_up_max_olb")
    private BigDecimal topUpMaxOlb;

    @Audited(targetAuditMode = NOT_AUDITED)
    @ManyToMany
    @JoinTable(
            name = "loan_products_entry_fees",
            joinColumns = @JoinColumn(name = "loan_product_id"),
            inverseJoinColumns = @JoinColumn(name = "entry_fee_id")
    )
    private List<EntryFee> fees;

    @NotAudited
    @ManyToMany
    @JoinTable(
            name = "loan_products_penalties",
            joinColumns = @JoinColumn(name = "loan_product_id"),
            inverseJoinColumns = @JoinColumn(name = "penalty_id")
    )
    private Set<Penalty> penalties;


    @NotAudited
    @OneToMany(mappedBy = "loanProduct", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<LoanProductAccount> accounts;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ScheduleBasedType scheduleBasedType;

    @NotAudited
    @OneToMany(mappedBy = "loanProduct", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<LoanProductProvision> provisions;

    @Enumerated(EnumType.STRING)
    @Column(name = "early_partial_repayment_fee_type")
    private EarlyRepaymentFeeType earlyPartialRepaymentFeeType;

    @Column(name = "early_partial_repayment_fee_value")
    private BigDecimal earlyPartialRepaymentFeeValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "early_total_repayment_fee_type")
    private EarlyRepaymentFeeType earlyTotalRepaymentFeeType;

    @Column(name = "early_total_repayment_fee_value")
    private BigDecimal earlyTotalRepaymentFeeValue;

    @Column(name = "maturity_date_max")
    private LocalDate maturityDateMax;
}
