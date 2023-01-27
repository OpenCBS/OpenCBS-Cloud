package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "loans_events_accounting_entries")
public class LoanEventAccountingEntry extends BaseEntity {

    @Column(name = "loan_event_id", nullable = false)
    private Long loanEventId;

    @Column(name = "accounting_entry_id", nullable = false)
    private Long accountingEntryId;
}
