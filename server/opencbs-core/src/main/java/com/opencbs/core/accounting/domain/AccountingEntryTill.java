package com.opencbs.core.accounting.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.enums.TillOperation;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.domain.till.Till;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "accounting_entries_tills")
public class AccountingEntryTill extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accounting_entries_id", nullable = false)
    private AccountingEntry accountingEntries;

    @Enumerated(EnumType.STRING)
    @Column(name = "operation_type", nullable = false)
    private TillOperation operationType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "initiated_by")
    private Profile initiatedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "till_id", nullable = false)
    private Till till;

    @Column(name = "document_number")
    private String documentNumber;

    @Column(name = "initiator")
    private String initiator;
}
