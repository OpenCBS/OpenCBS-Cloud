package com.opencbs.bonds.domain;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.BaseEvent;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@EqualsAndHashCode(exclude = "accountingEntry", callSuper = true)

@Entity
@Table(name = "bonds_events")
public class BondEvent extends BaseEvent {

    @Column(name = "bond_id", nullable = false)
    private Long bondId;

    @OneToMany
    @JoinTable(name = "bonds_events_accounting_entries",
                joinColumns = @JoinColumn(name = "bond_event_id"),
                inverseJoinColumns = @JoinColumn(name = "accounting_entry_id"))
    private List<AccountingEntry> accountingEntry = new ArrayList<>();
}
