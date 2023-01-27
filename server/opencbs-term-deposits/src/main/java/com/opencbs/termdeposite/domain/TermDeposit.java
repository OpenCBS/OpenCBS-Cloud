package com.opencbs.termdeposite.domain;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.contracts.Contract;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.Frequency;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.termdeposite.domain.enums.TermDepositStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "term_deposits")
public class TermDeposit extends Contract {

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "locked", nullable = false)
    private boolean locked;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TermDepositStatus status;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "term_agreement", nullable = false)
    private BigDecimal termAgreement;

    @Column(name = "interest_rate", nullable = false)
    private BigDecimal interestRate;

    @Enumerated(EnumType.STRING)
    @Column(name = "interest_accrual_frequency", nullable = false)
    private Frequency interestAccrualFrequency = Frequency.DAILY;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "term_deposit_product_id")
    private TermDepositProduct termDepositProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @Column(name = "open_date")
    private LocalDateTime openDate;

    @Column(name = "close_date")
    private LocalDateTime closeDate;

    @Column(name = "reopen_date")
    private LocalDateTime reopenDate;

    @Column(name = "early_close_fee_rate")
    private BigDecimal earlyCloseFeeRate;

    @Column(name = "early_close_fee_flat")
    private BigDecimal earlyCloseFeeFlat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opened_by_id")
    private User openedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "closed_by_id")
    private User closedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reopened_by_id")
    private User reopenedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_officer_id")
    private User serviceOfficer;

    @OneToMany(mappedBy = "termDeposit", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<TermDepositAccount> accounts;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "term_deposit_accounting_entries",
            joinColumns = @JoinColumn(name = "term_deposit_id"),
            inverseJoinColumns = @JoinColumn(name = "accounting_entry_id"))
    private List<AccountingEntry> accountingEntries;

    public TermDeposit(@NonNull Long id) {
        super(id);
    }
}
