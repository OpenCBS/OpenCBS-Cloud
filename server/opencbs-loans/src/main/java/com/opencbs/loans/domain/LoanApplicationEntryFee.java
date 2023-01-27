package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.EntryFee;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Data
@Table(name="loan_applications_entry_fees")
public class LoanApplicationEntryFee extends BaseEntity {
    @Column(name="amount", precision = 12, scale = 4)
    private BigDecimal amount;

    @Column(name="rate", precision = 12, scale = 4)
    private BigDecimal rate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="loan_application_id")
    private LoanApplication loanApplication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="entry_fee_id")
    private EntryFee entryFee;
}
