package com.opencbs.bonds.dayclosure;

import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.operationdayservices.ContractProcessService;
import com.opencbs.core.services.operationdayservices.DayClosureProcessor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActualizeBondStarterService {

    private final BondContainer bondContainer;
    private final DayClosureContractService dayClosureContractService;
    private final ContractProcessService contractProcessService;


    public void actualizing(@NonNull Long bondId, @NonNull LocalDate date, @NonNull User user) {
        LocalDate lastRunContainerDate = dayClosureContractService.getLastRunDay(bondId, bondContainer.getProcessingServices().get(0).getProcessType());

        List<DayClosureProcessor> processors = bondContainer.getProcessingServices();
        while (DateHelper.lessOrEqual(lastRunContainerDate, date)) {
            for (DayClosureProcessor processor : processors) {
                contractProcessService.processContract(lastRunContainerDate, processor, bondId, user);
            }

            lastRunContainerDate = lastRunContainerDate.plusDays(1);
        }
    }
}
