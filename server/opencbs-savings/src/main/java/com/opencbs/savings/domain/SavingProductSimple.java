package com.opencbs.savings.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "saving_products")
public class SavingProductSimple extends BaseEntity {

    @Column(name = "currency_id")
    private Long currencyId;

    @Column(name = "min_balance")
    private BigDecimal minBalance = BigDecimal.ZERO;
}