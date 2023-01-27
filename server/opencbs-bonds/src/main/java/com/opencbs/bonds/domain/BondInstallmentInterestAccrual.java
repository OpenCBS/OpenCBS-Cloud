package com.opencbs.bonds.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "bonds_installments")
public class BondInstallmentInterestAccrual extends BaseEntity {

    @Column(name = "bonds_id")
    private Long bondId;

    @Column(name = "number")
    private Integer number;

    @Column(name = "last_accrual_date")
    private LocalDate lastAccrualDate;

    @Column(name = "interest")
    private BigDecimal interest;
}
