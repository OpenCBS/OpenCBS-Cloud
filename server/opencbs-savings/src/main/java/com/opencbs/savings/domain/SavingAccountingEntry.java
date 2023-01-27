package com.opencbs.savings.domain;

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
@Table(name = "savings_accounting_entries")
public class SavingAccountingEntry extends BaseEntity {

    @Column(name = "saving_id")
    private Long savingId;

    @Column(name = "accounting_entry_id")
    private Long accountingEntryId;
}