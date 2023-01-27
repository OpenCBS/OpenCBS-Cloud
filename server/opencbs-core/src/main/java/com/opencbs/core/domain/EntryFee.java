package com.opencbs.core.domain;

import com.opencbs.core.accounting.domain.Account;
import lombok.Data;
import org.hibernate.envers.NotAudited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "entry_fees")
@Data
public class EntryFee extends NamedBaseEntity {

    @Column(name = "min_value", nullable = false, precision = 8, scale = 4)
    private BigDecimal minValue;

    @Column(name = "max_value", nullable = false, precision = 8, scale = 4)
    private BigDecimal maxValue;

    @Column(name = "is_percentage", nullable = false)
    private boolean isPercentage;

    @Column(name = "min_limit", precision = 11, scale = 4)
    private BigDecimal minLimit;

    @Column(name = "max_limit", precision = 11, scale = 4)
    private BigDecimal maxLimit;

    @NotAudited
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;
}
