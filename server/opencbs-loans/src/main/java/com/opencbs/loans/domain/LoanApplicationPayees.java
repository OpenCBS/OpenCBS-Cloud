package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.Payee;
import com.opencbs.core.domain.User;
import com.opencbs.loans.domain.enums.LoanApplicationPayeeStatus;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "loan_applications_payees")
public class LoanApplicationPayees extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_application_id", nullable = false)
    private LoanApplication loanApplication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payee_id", nullable = false)
    private Payee payee;

    @Column(name = "amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "planned_disbursement_date")
    private LocalDate plannedDisbursementDate;

    @Column(name = "disbursement_date")
    private LocalDate disbursementDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LoanApplicationPayeeStatus status;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "closed_by_id")
    private User closedBy;
}