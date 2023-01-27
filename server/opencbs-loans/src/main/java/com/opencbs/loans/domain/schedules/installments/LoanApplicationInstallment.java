package com.opencbs.loans.domain.schedules.installments;

import com.opencbs.core.domain.schedule.installments.ScheduleInstallment;
import com.opencbs.loans.domain.LoanApplication;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "loan_applications_installments")
public class LoanApplicationInstallment extends ScheduleInstallment {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_application_id", nullable = false)
    private LoanApplication loanApplication;
}
