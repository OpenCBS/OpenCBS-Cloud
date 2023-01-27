package com.opencbs.loans.domain;

import com.opencbs.core.domain.Branch;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Data
public class SimplifiedLoanApplication extends SimplifiedLoanBase {
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LoanApplicationStatus status;

    @Column(name = "branch", nullable = false)
    private Branch branch;
}
