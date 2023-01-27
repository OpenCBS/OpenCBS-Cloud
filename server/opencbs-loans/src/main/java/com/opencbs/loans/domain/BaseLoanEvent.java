package com.opencbs.loans.domain;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.BaseEvent;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.MappedSuperclass;
import java.util.List;

@Data
@EqualsAndHashCode(exclude = {"groupKey"}, callSuper = false)

@MappedSuperclass
public class BaseLoanEvent extends BaseEvent {

    @Column(name = "loan_id", nullable = false)
    private Long loanId;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "loans_events_accounting_entries",
               joinColumns = @JoinColumn(name = "loan_event_id"),
               inverseJoinColumns = @JoinColumn(name = "accounting_entry_id"))
    private List<AccountingEntry> accountingEntry;

}
