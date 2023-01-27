package com.opencbs.core.accounting.domain;

import com.opencbs.core.analytics.accounting.AccountingEntryListener;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.domain.json.ExtraJsonType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ResultCheckStyle;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)

@Entity
@EntityListeners(AccountingEntryListener.class)
@Table(name = "accounting_entries")
@TypeDef(name = "ExtraJsonType", typeClass = ExtraJsonType.class)
@SQLDelete(sql = "update accounting_entries set deleted = true where id = ?1", check = ResultCheckStyle.COUNT)
public class AccountingEntry extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debit_account_id", nullable = false)
    private Account debitAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "credit_account_id", nullable = false)
    private Account creditAccount;

    @Column(name = "amount", precision = 14, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "effective_at")
    private LocalDateTime effectiveAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(name = "description", nullable = false)
    private String description;

    @Type(type = "ExtraJsonType")
    @Column(name = "extra", columnDefinition = "jsonb")
    private ExtraJson extra;

    @Builder.Default
    @Column(name = "deleted")
    private Boolean deleted = false;
}
