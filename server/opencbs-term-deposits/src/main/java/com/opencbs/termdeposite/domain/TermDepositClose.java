package com.opencbs.termdeposite.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "term_deposits")
public class TermDepositClose extends BaseEntity {

    @Column(name = "open_date")
    private LocalDateTime openDate;

    @Column(name = "term_agreement", nullable = false)
    private BigDecimal termAgreement;
}
