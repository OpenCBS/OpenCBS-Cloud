package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.loans.domain.enums.LoanStatus;
import lombok.Data;
import org.hibernate.annotations.Immutable;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Immutable
@Table(name = "view_loans")
public class SimplifiedLoan extends BaseEntity {

    @Column(name = "profile_name", nullable = false)
    private String profileName;

    @Column(name = "amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "code")
    private String code;

    @Column(name = "interest_rate", precision = 8, scale = 4, nullable = false)
    private BigDecimal interestRate;

    @Column(name = "application_id")
    private Long applicationId;

    @Column(name = "application_code")
    private String applicationCode;

    @Column(name = "profile_type")
    private String type;

    @Column(name = "loan_product_name")
    private String productName;

    @Column(name = "created_by")
    private String createdBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private LoanStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "branch_name")
    private String branchName;

    @Column(name = "currency")
    private String currency;

    @Column(name = "disbursement_date")
    private LocalDate disbursementDate;

    @Column(name = "maturity_date")
    private LocalDate maturityDate;

    @Column(name = "loan_officer_id")
    private Long loanOfficerId;

    @Column(name = "credit_line_name")
    private String creditLine;

    @Column(name = "outstanding_amount")
    private BigDecimal creditLineOutstandingAmount;
}
