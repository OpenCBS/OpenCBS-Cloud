package com.opencbs.loans.services.loanreschedule;

import com.opencbs.core.dto.ManualEditRescheduleDto;
import com.opencbs.core.dto.RescheduleDto;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanInstallment;

import java.time.LocalTime;
import java.util.List;

public interface LoanRescheduleService {

    List<LoanInstallment> preview(Loan loan, RescheduleDto rescheduleDto);
    void reschedule(Loan loan, ManualEditRescheduleDto manualEditRescheduleDto, LocalTime timeEvent);
}
