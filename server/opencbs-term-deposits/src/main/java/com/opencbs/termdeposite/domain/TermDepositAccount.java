package com.opencbs.termdeposite.domain;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.termdeposite.domain.enums.TermDepositAccountType;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "term_deposit_accounts")
public class TermDepositAccount extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TermDepositAccountType type;

    @Column(name = "term_deposit_id", insertable = false, updatable = false)
    private Long termDepositId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "term_deposit_id", nullable = false)
    private TermDeposit termDeposit;

    @Column(name = "account_id", insertable = false, updatable = false)
    private Long accountId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

}
