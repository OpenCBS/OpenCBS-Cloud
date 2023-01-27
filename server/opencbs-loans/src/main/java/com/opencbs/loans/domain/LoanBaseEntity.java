package com.opencbs.loans.domain;

import com.opencbs.core.contracts.Contract;
import com.opencbs.core.domain.User;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@MappedSuperclass
public abstract class LoanBaseEntity extends Contract {

    @Column(name = "amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "interest_rate", precision = 8, scale = 4, nullable = false)
    private BigDecimal interestRate;

    @Column(name = "preferred_repayment_date", nullable = false)
    private LocalDate preferredRepaymentDate;

    @Column(name = "maturity_date")
    private LocalDate maturityDate;

    @Column(name = "maturity", nullable = false)
    private int maturity;

    @Column(name = "grace_period", nullable = false)
    private int gracePeriod;

    @Enumerated(EnumType.STRING)
    @Column(name = "schedule_type", nullable = false)
    private ScheduleGeneratorTypes scheduleType;

    @Column(name = "currency_id", nullable = false)
    private Long currencyId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "disbursement_date", nullable = false)
    private LocalDate disbursementDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_officer_id")
    private User loanOfficer;

    @Column(name = "code", nullable = false)
    private String code;
}
