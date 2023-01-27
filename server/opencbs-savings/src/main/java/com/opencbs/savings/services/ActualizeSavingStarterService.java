package com.opencbs.savings.services;

import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.operationdayservices.ContractProcessService;
import com.opencbs.core.services.operationdayservices.DayClosureProcessor;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ActualizeSavingStarterService{

    private final SavingContainer savingService;
    private final DayClosureContractService dayClosureContractService;
    private final ContractProcessService contractProcessService;

    public ActualizeSavingStarterService(SavingContainer savingService,
                                         DayClosureContractService dayClosureContractService,
                                         ContractProcessService contractProcessService) {
        this.savingService = savingService;
        this.dayClosureContractService = dayClosureContractService;
        this.contractProcessService = contractProcessService;
    }

    public void actualizing(@NonNull Long contractId, LocalDate date, User user) {
        LocalDate lastRunContainerDate = dayClosureContractService.getLastRunDay(contractId,
                this.savingService.getProcessingServices().get(0).getProcessType());
        while (DateHelper.lessOrEqual(lastRunContainerDate, date)) {

            for (DayClosureProcessor process : savingService.getProcessingServices()) {
                this.contractProcessService.processContract(lastRunContainerDate, process, contractId, user);
            }

            lastRunContainerDate = lastRunContainerDate.plusDays(1);
        }
    }
}
