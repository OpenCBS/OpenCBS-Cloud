package com.opencbs.borrowings.domain;

import com.opencbs.borrowings.domain.enums.BorrowingRuleType;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.accounting.domain.Account;
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
@Table(name = "borrowing_products_accounts")
public class BorrowingProductAccount extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrowing_product_id", nullable = false)
    private BorrowingProduct borrowingProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private BorrowingRuleType borrowingAccountRuleType;
}