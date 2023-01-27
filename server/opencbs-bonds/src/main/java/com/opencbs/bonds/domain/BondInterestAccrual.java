package com.opencbs.bonds.domain;

import com.opencbs.bonds.domain.enums.BondStatus;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.contracts.Contract;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.Frequency;
import com.opencbs.core.domain.enums.InterestScheme;
import com.opencbs.core.domain.profiles.Profile;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "bonds")
public class BondInterestAccrual extends Contract {

    @Column(name = "isin", nullable = false)
    private String isin;

    @Column(name = "number", nullable = false)
    private Integer number;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "equivalent_amount", nullable = false)
    private BigDecimal equivalentAmount;

    @ManyToOne
    @JoinColumn(name = "currency_id")
    private Currency currency;

    @Column(name = "interest_rate")
    private BigDecimal interestRate;

    @Column(name = "penalty_rate")
    private BigDecimal penaltyRate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "value_date")
    private LocalDate valueDate;

    @Column(name = "sell_date")
    private LocalDate sellDate;

    @Column(name = "expire_date")
    private LocalDate expireDate;

    @Column(name = "coupon_date")
    private LocalDate couponDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "frequency")
    private Frequency frequency;

    @Column(name = "maturity", nullable = false)
    private Integer maturity;

    @Enumerated(EnumType.STRING)
    @Column(name = "interest_scheme")
    private InterestScheme interestScheme;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BondStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_account_id", nullable = false)
    private Account bankAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private BondProduct bondProduct;

    @OneToMany(mappedBy = "bond", cascade = CascadeType.REFRESH)
    private List<BondAccount> bondAccounts;

}
