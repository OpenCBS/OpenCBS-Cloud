package com.opencbs.loans.services;

import com.opencbs.core.dto.ManualEditRescheduleDto;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.loans.domain.Loan;
import lombok.NonNull;

public interface LoanInstallmentsService {

    ScheduleDto preview(Long loanId, ManualEditRescheduleDto installments);

    void validate(@NonNull Loan loan, @NonNull ManualEditRescheduleDto manualEditRescheduleDto);
}
