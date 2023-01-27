package com.opencbs.termdeposite.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.NamedEntity;
import com.opencbs.core.domain.enums.Frequency;
import com.opencbs.core.domain.enums.StatusType;
import lombok.Data;
import lombok.EqualsAndHashCode;
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
@Entity
@Audited
@Table(name = "term_deposit_products")
@EqualsAndHashCode(callSuper = true)
public class TermDepositProduct extends BaseEntity implements NamedEntity {

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "code", nullable = false, length = 32)
    private String code;

    @Column(name = "availability", nullable = false)
    private Integer availability;

    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency;

    @Column(name = "amount_min", nullable = false)
    private BigDecimal amountMin;

    @Column(name = "amount_max", nullable = false)
    private BigDecimal amountMax;

    @Column(name = "interest_rate_min", nullable = false)
    private BigDecimal interestRateMin;

    @Column(name = "interest_rate_max", nullable = false)
    private BigDecimal interestRateMax;

    @Column(name = "term_agreement_min", nullable = false)
    private BigDecimal termAgreementMin;

    @Column(name = "term_agreement_max", nullable = false)
    private BigDecimal termAgreementMax;

    @Enumerated(EnumType.STRING)
    private Frequency interestAccrualFrequency;

    @NotAudited
    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<TermDepositProductAccount> termDepositAccountList;

    @Column(name = "early_close_fee_flat_min", nullable = false)
    private BigDecimal earlyCloseFeeFlatMin;

    @Column(name = "early_close_fee_flat_max", nullable = false)
    private BigDecimal earlyCloseFeeFlatMax;

    @Column(name = "early_close_fee_rate_min", nullable = false)
    private BigDecimal earlyCloseFeeRateMin;

    @Column(name = "early_close_fee_rate_max", nullable = false)
    private BigDecimal earlyCloseFeeRateMax;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false)
    private StatusType statusType = StatusType.ACTIVE;
}