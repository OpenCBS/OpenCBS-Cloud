package com.opencbs.loans.domain.creditCommittee;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.Role;
import com.opencbs.core.domain.User;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@MappedSuperclass
@Data
public abstract class CreditCommitteeVoteHistoryBaseEntity extends BaseEntity {

    @GeneratedValue(strategy = GenerationType.AUTO)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_application_id", nullable = false)
    private LoanApplication loanApplication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LoanApplicationStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_id")
    private User changedBy;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}

