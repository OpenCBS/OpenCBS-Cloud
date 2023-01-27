package com.opencbs.borrowings.domain;

import com.opencbs.core.contracts.Contract;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "borrowings")
public class BorrowingInterestAccrual extends Contract {

    @Column(name = "interest_rate")
    private BigDecimal interestRate;

    @Column(name = "disbursement_date")
    private LocalDateTime disbursementDate;
}
