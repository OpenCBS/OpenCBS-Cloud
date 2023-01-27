package com.opencbs.loans.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "loans")
public class LoanInterestAccrual extends LoanBaseEntity {

    @Column(name = "interest_rate")
    private BigDecimal interestRate;
}
