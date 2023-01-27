package com.opencbs.loans.services;

import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.dto.ScheduleDto;

import java.util.List;

public interface LoanApplicationInstallmentsService {

    ScheduleDto preview(Long loanApplicationId, List<Installment> installments);

    ScheduleDto update(Long loanApplicationId, List<Installment> installments);
}
