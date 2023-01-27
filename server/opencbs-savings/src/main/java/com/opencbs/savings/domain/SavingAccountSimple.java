package com.opencbs.savings.domain;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "savings_accounts")
public class SavingAccountSimple extends BaseEntity {

    @Column(name = "saving_id")
    private Long savingId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private SavingAccountRuleType type;

    @Column(name = "account_id", insertable = false, updatable = false)
    private Long accountId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;
}
