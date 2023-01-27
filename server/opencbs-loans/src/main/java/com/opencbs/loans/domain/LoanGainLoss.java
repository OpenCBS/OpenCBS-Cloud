package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "loans")
public class LoanGainLoss extends BaseEntity {

    @Column(name = "currency_id")
    private Long currencyId;
}
