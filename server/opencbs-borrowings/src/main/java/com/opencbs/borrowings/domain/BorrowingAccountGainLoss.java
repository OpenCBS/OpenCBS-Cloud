package com.opencbs.borrowings.domain;

import com.opencbs.borrowings.domain.enums.BorrowingRuleType;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "borrowing_accounts")
public class BorrowingAccountGainLoss extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private BorrowingRuleType accountRuleType;

    @Column(name = "borrowing_id")
    private Long borrowingId;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;
}