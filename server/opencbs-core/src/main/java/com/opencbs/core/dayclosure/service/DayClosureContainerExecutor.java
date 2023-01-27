package com.opencbs.core.dayclosure.service;

import com.opencbs.core.domain.User;
import com.opencbs.core.services.operationdayservices.Container;
import com.opencbs.core.services.operationdayservices.ContractProcessService;
import com.opencbs.core.services.operationdayservices.DayClosureProcessor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.Future;

@Component
@RequiredArgsConstructor
public class DayClosureContainerExecutor {

    private final ContractProcessService contractProcessService;


    @Async
    public Future<Void> processContainerContracts(@NonNull Container container,
                                                  @NonNull List<Long> contracts,
                                                  @NonNull LocalDate closureDate,
                                                  @NonNull User currentUser) {
        if (CollectionUtils.isEmpty(contracts)) {
            return null;
        }

        List<DayClosureProcessor> processors = container.getProcessingServices();
        for (Long contractId : contracts) {
            processContract(processors, contractId, closureDate, currentUser);
        }

        return null;
    }

    private void processContract(@NonNull List<DayClosureProcessor> processors,
                                 @NonNull Long contractId,
                                 @NonNull LocalDate closureDate,
                                 @NonNull User currentUser) {
        for (DayClosureProcessor processor : processors) {
            contractProcessService.processContract(closureDate, processor, contractId, currentUser);
        }
    }
}
