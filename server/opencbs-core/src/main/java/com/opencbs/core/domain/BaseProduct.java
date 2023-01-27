package com.opencbs.core.domain;

import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.Data;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.NotAudited;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import java.math.BigDecimal;

@AuditOverride(forClass = NamedBaseEntity.class, isAudited = true)
@MappedSuperclass
@Data
public abstract class BaseProduct extends NamedBaseEntity {

    @Column(name = "code", nullable = false)
    private String code;

    @NotAudited
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "currency_id")
    private Currency currency;

    @Enumerated(EnumType.STRING)
    @Column(name = "schedule_type")
    private ScheduleGeneratorTypes scheduleType;

    @Column(name = "interest_rate_min", precision = 8, scale = 4, nullable = false)
    private BigDecimal interestRateMin;

    @Column(name = "interest_rate_max", precision = 8, scale = 4, nullable = false)
    private BigDecimal interestRateMax;

    @Column(name = "amount_min", precision = 14, scale = 2, nullable = false)
    private BigDecimal amountMin;

    @Column(name = "amount_max", precision = 14, scale = 2, nullable = false)
    private BigDecimal amountMax;

    @Column(name = "maturity_min", nullable = false)
    private int maturityMin;

    @Column(name = "maturity_max", nullable = false)
    private int maturityMax;

    @Column(name = "grace_period_min", nullable = false)
    private int gracePeriodMin;

    @Column(name = "grace_period_max", nullable = false)
    private int gracePeriodMax;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false)
    private StatusType statusType = StatusType.ACTIVE;
}
