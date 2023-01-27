package com.opencbs.bonds.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.enums.Frequency;
import lombok.Data;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.List;

@Data
@Entity
@Table(name = "bonds_product")
public class BondProduct extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "number_min", nullable = false)
    private BigDecimal numberMin;

    @Column(name = "number_max", nullable = false)
    private BigDecimal numberMax;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "currency_id")
    private Currency currency;

    @Column(name = "interest_rate_min", precision = 6, scale = 2, nullable = false)
    private BigDecimal interestRateMin;

    @Column(name = "interest_rate_max", precision = 6, scale = 2, nullable = false)
    private BigDecimal interestRateMax;

    @Column(name = "penalty_rate_min", precision = 6, scale = 2, nullable = false)
    private BigDecimal penaltyRateMin;

    @Column(name = "penalty_rate_max", precision = 6, scale = 2, nullable = false)
    private BigDecimal penaltyRateMax;

    @Enumerated(EnumType.STRING)
    @Column(name = "coupon_frequency", nullable = false)
    private Frequency frequency;

    @Column(name = "maturity_min", nullable = false)
    private int maturityMin;

    @Column(name = "maturity_max", nullable = false)
    private int maturityMax;

    @Column(name = "interest_scheme", nullable = false)
    private String interestScheme;

    @OneToMany(mappedBy = "bondProduct", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<BondProductAccount> accounts;
}
