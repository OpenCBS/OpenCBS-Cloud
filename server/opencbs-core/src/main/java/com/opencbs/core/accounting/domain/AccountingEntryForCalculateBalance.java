package com.opencbs.core.accounting.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Where;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)

@Immutable
@Entity
@Table(name = "accounting_entries")
@Where(clause = "deleted = false")
public class AccountingEntryForCalculateBalance extends BaseEntity{

    @Column(name = "debit_account_id")
    Long debitAccountId;

    @Column(name = "credit_account_id")
    Long creditAccountId;

    @Column(name = "amount")
    BigDecimal amount;

    @Column(name = "effective_at")
    LocalDateTime effectiveAt;
}