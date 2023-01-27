package com.opencbs.loans.services.loancloseday;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.loans.services.ProvisionService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class LoanProvisionDayClosureProcessor implements LoanDayClosureProcessor {

    private final ProvisionService provisionService;


    @Override
    public void processContract(@NonNull Long loanId, @NonNull LocalDate date, @NonNull User user) {
        this.provisionService.createReserveByLoanId(loanId, LocalDateTime.of(date, this.getProcessType().getOperationTime()));
    }

    @Override
    public ProcessType getProcessType() {
        return ProcessType.LOAN_PROVISION;
    }

    @Override
    public String getIdentityString() {
        return "loan.provision";
    }
}
