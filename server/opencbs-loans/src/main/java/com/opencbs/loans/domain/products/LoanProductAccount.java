package com.opencbs.loans.domain.products;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.enums.AccountRuleType;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "loan_products_accounts")
public class LoanProductAccount extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_product_id", nullable = false)
    private LoanProduct loanProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private AccountRuleType accountRuleType;
}