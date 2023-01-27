package com.opencbs.borrowings.services;

import com.opencbs.borrowings.dayclose.BorrowingContainer;
import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.operationdayservices.ContractProcessService;
import com.opencbs.core.services.operationdayservices.DayClosureProcessor;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ActualizeBorrowingStarterService {

    private final BorrowingContainer borrowingContainer;
    private final DayClosureContractService dayClosureContractService;
    private final ContractProcessService contractProcessService;

    public ActualizeBorrowingStarterService(BorrowingContainer borrowingContainer,
                                            DayClosureContractService dayClosureContractService,
                                            ContractProcessService contractProcessService) {
        this.borrowingContainer = borrowingContainer;
        this.dayClosureContractService = dayClosureContractService;
        this.contractProcessService = contractProcessService;
    }

    public void actualizing(@NonNull Long borrowingId, @NonNull LocalDate date, @NonNull User user) {
        LocalDate lastRunContainerDate = dayClosureContractService.getLastRunDay(borrowingId,
                this.borrowingContainer.getProcessingServices().get(0).getProcessType());

        while (DateHelper.lessOrEqual(lastRunContainerDate, date)) {
            List<DayClosureProcessor> processors = borrowingContainer.getProcessingServices();
            for (DayClosureProcessor processor : processors) {
                contractProcessService.processContract(lastRunContainerDate, processor, borrowingId, user);
            }

            lastRunContainerDate = lastRunContainerDate.plusDays(1);
        }
    }
}
