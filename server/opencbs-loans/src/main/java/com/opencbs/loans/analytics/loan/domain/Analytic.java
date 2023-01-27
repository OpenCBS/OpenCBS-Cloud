package com.opencbs.loans.analytics.loan.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "analytics_active_loans",
        uniqueConstraints = @UniqueConstraint(columnNames = {"loan_id", "calculated_date"}))
public class Analytic extends BaseEntity {
    @Column(name = "loan_id")
    private Long loanId;

    @Column(name = "calculated_date")
    private LocalDate calculatedDate;

    @Column(name = "disbursement_date")
    private LocalDateTime disbursementDate;

    @Column(name = "planned_close_date")
    private LocalDateTime plannedCloseDate;

    @Column(name = "close_date")
    private LocalDateTime closeDate;

    @Column(name = "profile_id")
    private Long profileId;

    @Column(name = "profile_name")
    private String profileName;

    @Column(name = "profile_type")
    private String profileType;

    @Column(name = "loan_product_id")
    private Long loanProductId;

    @Column(name = "loan_product_name")
    private String loanProductName;

    @Column(name = "loan_products_currency_id")
    private Long loanProductsCurrencyId;

    @Column(name = "loan_products_currency_name")
    private String loanProductsCurrencyName;

    @Column(name = "loan_purpose_id")
    private Long loanPurposeId;

    @Column(name = "loan_purpose_name")
    private String loanPurposeName;

    @Column(name = "loan_officer_id")
    private Long loanOfficerId;

    @Column(name = "loan_officer_name")
    private String loanOfficerName;

    @Column(name = "branch_id")
    private Long branchId;

    @Column(name = "branch_name")
    private String branchName;

    @Column(name = "address")
    private String address;

    @Column(name = "interest_rate")
    private BigDecimal interestRate;

    @Column(name = "interest")
    private BigDecimal interest;

    @Column(name = "total_interest")
    private BigDecimal total_interest;

    @Column(name = "principal")
    private BigDecimal principal;

    @Column(name = "olb")
    private BigDecimal olb;

    @Column(name = "late_principal")
    private BigDecimal latePrincipal;

    @Column(name = "late_interest")
    private BigDecimal lateInterest;

    @Column(name = "interest_due")
    private BigDecimal interestDue;

    @Column(name = "penalty_due")
    private BigDecimal penaltyDue;

    @Column(name = "late_days")
    private Integer lateDays;

    @Column(name = "next_repayment_id")
    private Long nextRepaymentId;
}
