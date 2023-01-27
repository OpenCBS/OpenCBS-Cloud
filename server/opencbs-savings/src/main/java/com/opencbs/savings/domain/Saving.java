package com.opencbs.savings.domain;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.contracts.Contract;
import com.opencbs.core.domain.NamedEntity;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.Frequency;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.savings.domain.enums.SavingStatus;
import lombok.Data;

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
@Entity
@Table(name = "savings")
public class Saving extends Contract implements NamedEntity {

    @Column(name = "code")
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saving_product_id", nullable = false)
    private SavingProduct product;

    @Column(name = "interest_rate", nullable = false)
    private BigDecimal interestRate;

    @Enumerated(EnumType.STRING)
    @Column(name = "interest_accrual_frequency", nullable = false)
    private Frequency interestAccrualFrequency;

    @Enumerated(EnumType.STRING)
    @Column(name = "interest_posting_frequency", nullable = false)
    private Frequency interestPostingFrequency;

    @Column(name = "capitalized", nullable = false)
    private boolean capitalized;

    //cash deposit parameters
    @Column(name = "deposit_amount_min", nullable = false)
    private BigDecimal depositAmountMin;

    @Column(name = "deposit_amount_max", nullable = false)
    private BigDecimal depositAmountMax;

    @Column(name = "deposit_fee_rate", nullable = false)
    private BigDecimal depositFeeRate;

    @Column(name = "deposit_fee_flat", nullable = false)
    private BigDecimal depositFeeFlat;

    //cash withdrawal parameters
    @Column(name = "withdrawal_amount_min", nullable = false)
    private BigDecimal withdrawalAmountMin;

    @Column(name = "withdrawal_amount_max", nullable = false)
    private BigDecimal withdrawalAmountMax;

    @Column(name = "withdrawal_fee_rate", nullable = false)
    private BigDecimal withdrawalFeeRate;

    @Column(name = "withdrawal_fee_flat", nullable = false)
    private BigDecimal withdrawalFeeFlat;

    //management fees
    @Column(name = "management_fee_rate", nullable = false)
    private BigDecimal managementFeeRate;

    @Column(name = "management_fee_flat", nullable = false)
    private BigDecimal managementFeeFlat;

    @Enumerated(EnumType.STRING)
    @Column(name = "management_fee_frequency", nullable = false)
    private Frequency managementFeeFrequency;

    //entry fees
    @Column(name = "entry_fee_rate", nullable = false)
    private BigDecimal entryFeeRate;

    @Column(name = "entry_fee_flat", nullable = false)
    private BigDecimal entryFeeFlat;

    //close fees
    @Column(name = "close_fee_rate", nullable = false)
    private BigDecimal closeFeeRate;

    @Column(name = "close_fee_flat", nullable = false)
    private BigDecimal closeFeeFlat;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SavingStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "open_date")
    private LocalDateTime openDate;

    @Column(name = "close_date")
    private LocalDateTime closeDate;

    @Column(name = "reopen_date")
    private LocalDateTime reopenDate;

    @Column(name = "deposit_date")
    private LocalDateTime depositDate;

    @Column(name = "withdraw_date")
    private LocalDateTime withdrawDate;

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
    @JoinColumn(name = "deposited_by_id")
    private User depositedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "withdrawed_by_id")
    private User withdrawBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saving_officer_id")
    private User savingOfficer;

    @OneToMany(mappedBy = "saving", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<SavingAccount> accounts;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "savings_accounting_entries",
            joinColumns = @JoinColumn(name = "saving_id"),
            inverseJoinColumns = @JoinColumn(name = "accounting_entry_id"))
    private List<AccountingEntry> accountingEntries;

    @Column(name = "locked", nullable = false)
    private boolean locked;

    @Override
    public String getName() {
        return this.getCode();
    }
}
