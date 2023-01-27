package com.opencbs.core.accounting.domain;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.NamedBaseEntity;
import com.opencbs.core.domain.NamedEntity;
import com.opencbs.core.domain.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.hibernate.envers.RelationTargetAuditMode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)

@Audited
@AuditOverride(forClass = NamedBaseEntity.class)

@Entity
@Table(name = "accounts")
public class Account extends NamedBaseEntity implements NamedEntity {

    @Column(name = "number", nullable = false)
    private String number;

    @Column(name = "is_debit", nullable = false)
    private Boolean isDebit;

    @Column(name = "lft")
    private Integer lft;

    @Column(name = "rgt")
    private Integer rgt;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "close_date")
    private LocalDateTime closeDate;

    @Column(name = "type")
    private AccountType type;

    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "currency_id")
    private Currency currency;

    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(name = "validate_off")
    private Boolean validateOff;

    @NotAudited
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Account parent;

    @Column(name = "locked", nullable = false)
    private Boolean locked;

    @Column(name = "allowed_transfer_from", nullable = false)
    private Boolean allowedTransferFrom;

    @Column(name = "allowed_transfer_to", nullable = false)
    private Boolean allowedTransferTo;

    @Column(name = "allowed_cash_deposit", nullable = false)
    private Boolean allowedCashDeposit;

    @Column(name = "allowed_cash_withdrawal", nullable = false)
    private Boolean allowedCashWithdrawal;

    @Column(name = "allowed_manual_transaction", nullable = false)
    private Boolean allowedManualTransaction;

    @NotAudited
    @Formula(value = "(exists(select * from accounts a where a.parent_id = id))")
    private Boolean hasChildren;
}
