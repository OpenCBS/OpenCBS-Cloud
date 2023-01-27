package com.opencbs.borrowings.domain;

import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.BaseEvent;
import com.opencbs.core.domain.json.ExtraJson;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import java.util.List;

@Data
@EqualsAndHashCode(exclude = "accountingEntry", callSuper = true)

@Entity
@Table(name = "borrowing_events")
public class BorrowingEvent extends BaseEvent {

    @Column(name = "borrowing_id", nullable = false)
    private Long borrowingId;

    @Type(type = "ExtraJsonType")
    @Column(name = "extra", columnDefinition = "jsonb")
    private ExtraJson extra;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "borrowing_events_accounting_entries",
            joinColumns = @JoinColumn(name = "borrowing_event_id"),
            inverseJoinColumns = @JoinColumn(name = "accounting_entry_id"))
    private List<AccountingEntry> accountingEntry;
}
