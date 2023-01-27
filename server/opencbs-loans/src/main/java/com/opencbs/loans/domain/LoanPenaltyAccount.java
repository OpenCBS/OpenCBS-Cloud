package com.opencbs.loans.domain;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "loan_penalty_accounts")
public class LoanPenaltyAccount extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id", nullable = false)
    private Loan loan;

    @Column(name = "loan_id", insertable = false, updatable = false)
    private Long loanId;

    @Column(name = "loan_application_penalty_id", insertable = false, updatable = false)
    private Long loanApplicationPenaltyId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_application_penalty_id", nullable = false)
    private LoanApplicationPenalty loanApplicationPenalty;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "income_account_id", nullable = false)
    private Account incomeAccount;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accrual_account_id", nullable = false)
    private Account accrualAccount;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "write_off_account_id", nullable = false)
    private Account writeOffAccount;
}
