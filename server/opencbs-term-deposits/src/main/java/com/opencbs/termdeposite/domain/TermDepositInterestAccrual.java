package com.opencbs.termdeposite.domain;

import com.opencbs.core.contracts.Contract;
import com.opencbs.termdeposite.domain.enums.TermDepositStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "term_deposits")
public class TermDepositInterestAccrual extends Contract {

    @Column(name = "code", nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TermDepositStatus status;

    @Column(name = "term_agreement", nullable = false)
    private BigDecimal termAgreement;

    @Column(name = "interest_rate", nullable = false)
    private BigDecimal interestRate;

    @Column(name = "open_date")
    private LocalDateTime openDate;
}
