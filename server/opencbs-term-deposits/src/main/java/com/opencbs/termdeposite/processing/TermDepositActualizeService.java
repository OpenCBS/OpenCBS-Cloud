package com.opencbs.termdeposite.processing;

import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.operationdayservices.ContractProcessService;
import com.opencbs.core.services.operationdayservices.DayClosureProcessor;
import com.opencbs.termdeposite.domain.TermDeposit;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class TermDepositActualizeService {

    private final TermDepositContainer termDepositContainer;
    private final DayClosureContractService dayClosureContractService;
    private final ContractProcessService contractProcessService;

    public TermDepositActualizeService(@NonNull TermDepositContainer termDepositContainer,
                                       @NonNull DayClosureContractService dayClosureContractService,
                                       @NonNull ContractProcessService contractProcessService) {
        this.termDepositContainer = termDepositContainer;
        this.dayClosureContractService = dayClosureContractService;
        this.contractProcessService = contractProcessService;
    }

    public void actualizing(@NonNull TermDeposit termDeposit, LocalDate date, User user) {
        LocalDate lastRunContainerDate = dayClosureContractService.getLastRunDay(termDeposit.getId(),
                this.termDepositContainer.getProcessingServices().get(0).getProcessType());

        while (DateHelper.lessOrEqual(lastRunContainerDate, date)) {
            for (DayClosureProcessor process : termDepositContainer.getProcessingServices()) {
                this.contractProcessService.processContract(lastRunContainerDate, process, termDeposit.getId(), user);
            }

            lastRunContainerDate = lastRunContainerDate.plusDays(1);
        }
    }
}
