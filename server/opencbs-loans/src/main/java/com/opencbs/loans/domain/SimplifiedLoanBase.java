package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@MappedSuperclass
public abstract class SimplifiedLoanBase extends BaseEntity {
    @Column(name = "profile_id", nullable = false)
    private Long profileId;

    @Column(name = "profile_name", nullable = false)
    private String profileName;

    @Column(name = "profile_type")
    private String profileType;

    @Column(name = "amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "interest_rate", precision = 8, scale = 4, nullable = false)
    private BigDecimal interestRate;

    @Column(name = "schedule_type", nullable = false)
    private ScheduleGeneratorTypes scheduleType;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "created_by_id")
    private Long createdById;

    @Column(name = "created_by_first_name")
    private String createdByFirstName;

    @Column(name = "created_by_last_name")
    private String createdByLastName;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "loan_product_name", nullable = false)
    private String loanProductName;
}
