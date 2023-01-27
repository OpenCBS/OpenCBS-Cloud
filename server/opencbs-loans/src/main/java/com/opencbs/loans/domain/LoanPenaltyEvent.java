package com.opencbs.loans.domain;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.BaseEvent;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "loans_penalties_events")
//@SQLDelete(sql = "update loans_penalties_events set deleted = true where id = ?1", check = ResultCheckStyle.COUNT)
//@Where(clause = "deleted = false")
public class LoanPenaltyEvent extends BaseEvent {

    @Column(name = "loan_id", nullable = false)
    private Long loanId;

    @Column(name = "loan_application_penalty_id", nullable = false)
    private Long loanApplicationPenaltyId;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "loans_penalty_events_accounting_entries",
            joinColumns = @JoinColumn(name = "loan_penalty_event_id"),
            inverseJoinColumns = @JoinColumn(name = "accounting_entry_id"))
    private List<AccountingEntry> accountingEntry;
}
