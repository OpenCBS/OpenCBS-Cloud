package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.loans.domain.enums.ProvisionType;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "loan_specific_provisions")
@EqualsAndHashCode(callSuper = true)
public class LoanSpecificProvision extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id", nullable = false)
    private Loan loan;

    @Column(name = "loan_id", nullable = false, updatable = false, insertable = false)
    private Long loanId;

    @Enumerated(EnumType.STRING)
    @Column(name = "provision_type", nullable = false)
    private ProvisionType provisionType;

    @Column(name = "value", nullable = false)
    private BigDecimal value;

    @Column(name = "is_rate", nullable = false)
    private Boolean isRate = Boolean.TRUE;

    @Transient
    private Boolean isSpecific;
}
