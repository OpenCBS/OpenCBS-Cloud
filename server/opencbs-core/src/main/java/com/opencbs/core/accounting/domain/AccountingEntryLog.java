package com.opencbs.core.accounting.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.User;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "accounting_entries_logs")
public class AccountingEntryLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accounting_entry_id", nullable = false)
    private AccountingEntry accountingEntry;

    @Column(name = "effective_date")
    private LocalDateTime effectiveDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "handled")
    private Boolean handled = false;
}
