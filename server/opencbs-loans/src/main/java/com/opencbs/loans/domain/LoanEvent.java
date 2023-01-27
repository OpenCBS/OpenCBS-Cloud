package com.opencbs.loans.domain;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.BaseEvent;
import com.opencbs.core.domain.OtherFee;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "loans_events")
public class LoanEvent extends BaseEvent {

    @Column(name = "loan_id", nullable = false)
    private Long loanId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "other_fee_id")
    private OtherFee otherFee;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "loans_events_accounting_entries",
               joinColumns = @JoinColumn(name = "loan_event_id"),
               inverseJoinColumns = @JoinColumn(name = "accounting_entry_id"))
    private List<AccountingEntry> accountingEntry;

    @Transient
    private Long loanApplicationPenaltyId;
}
