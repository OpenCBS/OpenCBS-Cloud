package com.opencbs.core.domain.schedule.installments;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.math.BigDecimal;
import java.time.LocalDate;


@MappedSuperclass
@Data
public abstract class ScheduleInstallment extends BaseEntity {

    @Column(name = "number", nullable = false)
    private long number;

    @Column(name = "maturity_date", nullable = false)
    private LocalDate maturityDate;

    @Column(name = "last_accrual_date", nullable = false)
    private LocalDate lastAccrualDate;

    @Column(name = "principal", precision = 12, scale = 2, nullable = false)
    private BigDecimal principal;

    @Column(name = "interest", precision = 12, scale = 2, nullable = false)
    private BigDecimal interest;

    @Column(name = "olb", precision = 12, scale = 2, nullable = false)
    private BigDecimal olb;
}
