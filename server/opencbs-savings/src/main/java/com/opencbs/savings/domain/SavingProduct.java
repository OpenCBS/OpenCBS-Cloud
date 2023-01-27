package com.opencbs.savings.domain;

import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.NamedBaseEntity;
import com.opencbs.core.domain.NamedEntity;
import com.opencbs.core.domain.enums.Frequency;
import com.opencbs.core.domain.enums.StatusType;
import lombok.Data;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.hibernate.envers.RelationTargetAuditMode;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.List;

@Data
@Audited
@AuditOverride(forClass = NamedBaseEntity.class, isAudited = true)
@Entity
@Table(name = "saving_products")
public class SavingProduct extends NamedBaseEntity implements NamedEntity {

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "availability", nullable = false)
    private int availability;

    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency;

    @Column(name = "initial_amount_min", precision = 14, scale = 2, nullable = false)
    private BigDecimal initialAmountMin;

    @Column(name = "initial_amount_max", precision = 14, scale = 2, nullable = false)
    private BigDecimal initialAmountMax;

    @Column(name = "interest_rate_min", precision = 8, scale = 4, nullable = false)
    private BigDecimal interestRateMin;

    @Column(name = "interest_rate_max", precision = 8, scale = 4, nullable = false)
    private BigDecimal interestRateMax;

    @Enumerated(EnumType.STRING)
    @Column(name = "interest_accrual_frequency", nullable = false)
    private Frequency interestAccrualFrequency;

    @Enumerated(EnumType.STRING)
    @Column(name = "posting_frequency", nullable = false)
    private Frequency postingFrequency;

    @Column(name = "capitalized")
    private boolean capitalized;

    @Column(name = "deposit_amount_min", precision = 14, scale = 2, nullable = false)
    private BigDecimal depositAmountMin;

    @Column(name = "deposit_amount_max", precision = 14, scale = 2, nullable = false)
    private BigDecimal depositAmountMax;

    @Column(name = "deposit_fee_rate_min", precision = 14, scale = 2)
    private BigDecimal depositFeeRateMin;

    @Column(name = "deposit_fee_rate_max", precision = 14, scale = 2)
    private BigDecimal depositFeeRateMax;

    @Column(name = "deposit_fee_flat_min", precision = 14, scale = 2)
    private BigDecimal depositFeeFlatMin;

    @Column(name = "deposit_fee_flat_max", precision = 14, scale = 2)
    private BigDecimal depositFeeFlatMax;

    @Column(name = "withdrawal_amount_min", precision = 14, scale = 2, nullable = false)
    private BigDecimal withdrawalAmountMin;

    @Column(name = "withdrawal_amount_max", precision = 14, scale = 2, nullable = false)
    private BigDecimal withdrawalAmountMax;

    @Column(name = "withdrawal_fee_rate_min", precision = 14, scale = 2)
    private BigDecimal withdrawalFeeRateMin;

    @Column(name = "withdrawal_fee_rate_max", precision = 14, scale = 2)
    private BigDecimal withdrawalFeeRateMax;

    @Column(name = "withdrawal_fee_flat_min", precision = 14, scale = 2)
    private BigDecimal withdrawalFeeFlatMin;

    @Column(name = "withdrawal_fee_flat_max", precision = 14, scale = 2)
    private BigDecimal withdrawalFeeFlatMax;

    @Column(name = "management_fee_rate_min", precision = 14, scale = 2)
    private BigDecimal managementFeeRateMin;

    @Column(name = "management_fee_rate_max", precision = 14, scale = 2)
    private BigDecimal managementFeeRateMax;

    @Column(name = "management_fee_flat_min", precision = 14, scale = 2)
    private BigDecimal managementFeeFlatMin;

    @Column(name = "management_fee_flat_max", precision = 14, scale = 2)
    private BigDecimal managementFeeFlatMax;

    @Enumerated(EnumType.STRING)
    @Column(name = "management_fee_frequency", nullable = false)
    private Frequency managementFeeFrequency;

    @Column(name = "entry_fee_rate_min", precision = 14, scale = 2)
    private BigDecimal entryFeeRateMin;

    @Column(name = "entry_fee_rate_max", precision = 14, scale = 2)
    private BigDecimal entryFeeRateMax;

    @Column(name = "entry_fee_flat_min", precision = 14, scale = 2)
    private BigDecimal entryFeeFlatMin;

    @Column(name = "entry_fee_flat_max", precision = 14, scale = 2)
    private BigDecimal entryFeeFlatMax;

    @Column(name = "close_fee_rate_min", precision = 14, scale = 2)
    private BigDecimal closeFeeRateMin;

    @Column(name = "close_fee_rate_max", precision = 14, scale = 2)
    private BigDecimal closeFeeRateMax;

    @Column(name = "close_fee_flat_min", precision = 14, scale = 2)
    private BigDecimal closeFeeFlatMin;

    @Column(name = "close_fee_flat_max", precision = 14, scale = 2)
    private BigDecimal closeFeeFlatMax;

    @NotAudited
    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<SavingProductAccount> accounts;

    @Column(name = "min_balance", nullable = false)
    private BigDecimal minBalance = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false)
    private StatusType statusType = StatusType.ACTIVE;
}