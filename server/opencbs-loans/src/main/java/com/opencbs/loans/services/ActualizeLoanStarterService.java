package com.opencbs.loans.services;

import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.operationdayservices.ContractProcessService;
import com.opencbs.core.services.operationdayservices.DayClosureProcessor;
import com.opencbs.loans.services.loancloseday.LoanContainer;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ActualizeLoanStarterService {

    private final LoanContainer loanContainer;
    private final DayClosureContractService dayClosureContractService;
    private final ContractProcessService contractProcessService;

    public ActualizeLoanStarterService(LoanContainer loanContainer,
                                       DayClosureContractService dayClosureContractService,
                                       ContractProcessService contractProcessService) {
        this.loanContainer = loanContainer;
        this.dayClosureContractService = dayClosureContractService;
        this.contractProcessService = contractProcessService;
    }

    public void actualizing(@NonNull Long loanId, @NonNull LocalDate date, @NonNull User user) {
        LocalDate lastRunContainerDate = dayClosureContractService.getLastRunDay(loanId,
                this.loanContainer.getProcessingServices().get(0).getProcessType());

        while (DateHelper.lessOrEqual(lastRunContainerDate, date)) {
            for (DayClosureProcessor process : loanContainer.getProcessingServices()) {
                this.contractProcessService.processContract(lastRunContainerDate, process, loanId, user);
            }

            lastRunContainerDate = lastRunContainerDate.plusDays(1);
        }
    }
}
