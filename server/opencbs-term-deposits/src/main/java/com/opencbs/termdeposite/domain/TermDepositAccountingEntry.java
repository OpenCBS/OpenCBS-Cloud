package com.opencbs.termdeposite.domain;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "term_deposit_accounting_entries")
public class TermDepositAccountingEntry extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "term_deposit_id")
    private TermDeposit termDeposit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accounting_entry_id")
    private AccountingEntry accountingEntry;

}
