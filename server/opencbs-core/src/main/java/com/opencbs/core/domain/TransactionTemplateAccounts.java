package com.opencbs.core.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "transaction_template_accounts")
public class TransactionTemplateAccounts extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "template_id")
    private TransactionTemplate transactionTemplate;

    @Column(name = "account_id", nullable = false)
    private Long accountId;

    @Column(name = "is_debit", nullable = false)
    private Boolean isDebit;
}