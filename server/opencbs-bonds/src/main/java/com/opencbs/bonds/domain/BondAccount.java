package com.opencbs.bonds.domain;

import com.opencbs.bonds.domain.enums.BondAccountRuleType;
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
@Table(name = "bonds_accounts")
public class BondAccount extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private BondAccountRuleType bondAccountRuleType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bond_id")
    private Bond bond;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;
}
