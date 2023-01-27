package com.opencbs.loans.notificators.impl;

import com.opencbs.core.helpers.DateHelper;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.notificators.LoanRemember;
import com.opencbs.loans.notificators.LoanRememberType;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.services.repayment.impl.InstallmentsHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;

@RequiredArgsConstructor
@Service
public class FirstDayOfDelinquency implements LoanRemember {

    private final static Integer DAYS_OF_DELINQUENCY = 1;

    private final LoanService loanService;


    @Override
    public LoanRememberType getType() {
        return LoanRememberType.FIRST_DAY_OF_DELINQUENCY;
    }

    @Override
    public HashMap getValues(Loan loan, LocalDate date) {
        HashMap values = new HashMap();

        values.put("customer_name", loan.getProfile().getNameFromCustomFields());
        values.put("loan_code", loan.getCode());
        values.put("loan_office_email", loan.getLoanOfficer().getEmail());

        final List<LoanInstallment> installmentsByLoan =
                this.loanService.getInstallmentsByLoan(loan.getId(), LocalDateTime.of(date, LocalTime.MAX), false, false);

        final List<LoanInstallment> expiredInstallments = InstallmentsHelper.getExpiredInstallments(installmentsByLoan, date);

        final BigDecimal totalAmount = expiredInstallments.stream()
                .map(LoanInstallment::getTotalDue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        final BigDecimal interestAmount = expiredInstallments.stream()
                .map(LoanInstallment::getInterestDue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        values.put("total_amount", totalAmount);
        values.put("principal_amount", totalAmount.subtract(interestAmount));
        values.put("interest_amount", interestAmount);

        return values;
    }

    @Override
    public String getTitle() {
        return "First day of delinquency";
    }

    @Override
    public Boolean isNeedSendReminder(Loan loan, LocalDate date) {
        final List<LoanInstallment> installmentsByLoan =
                this.loanService.getInstallmentsByLoan(loan.getId(), LocalDateTime.of(date, LocalTime.MAX), false, false);
        final List<LoanInstallment> expiredInstallments =
                InstallmentsHelper.getExpiredInstallments(installmentsByLoan, date);

        if (CollectionUtils.isEmpty(expiredInstallments)) {
            return false;
        }

        final LoanInstallment firstDelinquencyInstallment = expiredInstallments.get(0);
        if (!DateHelper.equal(firstDelinquencyInstallment.getMaturityDate().plusDays(DAYS_OF_DELINQUENCY), date)) {
            return false;
        }

        return true;
    }
}
