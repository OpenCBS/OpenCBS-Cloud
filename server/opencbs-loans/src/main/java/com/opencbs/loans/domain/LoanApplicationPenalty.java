package com.opencbs.loans.domain;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.NamedBaseEntity;
import com.opencbs.core.domain.enums.PenaltyType;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Data
@Table(name="loan_application_penalties")
public class LoanApplicationPenalty extends NamedBaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="loan_application_id", nullable = false)
    private LoanApplication loanApplication;

    @Column(name = "begin_period_day", nullable = false)
    private Integer beginPeriodDay;

    @Column(name = "end_period_day", nullable = false)
    private Integer endPeriodDay;

    @Column(name = "grace_period",nullable = false)
    private Integer gracePeriod = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "penalty_type", nullable = false)
    private PenaltyType penaltyType;

    @Column(name = "penalty", nullable = false)
    private BigDecimal penalty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accrual_account_id", nullable = false)
    private Account accrualAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "income_account_id", nullable = false)
    private Account incomeAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "write_off_account_id", nullable = false)
    private Account writeOffAccount;
}
