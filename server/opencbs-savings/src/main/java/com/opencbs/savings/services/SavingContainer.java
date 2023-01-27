package com.opencbs.savings.services;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.services.operationdayservices.Container;
import com.opencbs.core.services.operationdayservices.DayClosureProcessor;
import com.opencbs.savings.domain.enums.SavingStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class SavingContainer implements Container {

    private final SavingService savingService;
    private final ApplicationContext context;
    private static List<DayClosureProcessor> savingDayClosureProcessorList;

    @Autowired
    protected SavingContainer(SavingService savingService,
                              ApplicationContext context) {
        this.savingService = savingService;
        this.context = context;
    }

    @Override
    public List<Long> getIdsContracts(Branch branch) {
        return this.savingService.findIdsWhenSavingHasStatus(SavingStatus.OPEN, branch);
    }

    @Override
    public List<DayClosureProcessor> getProcessingServices() {
        if (savingDayClosureProcessorList == null) {
            savingDayClosureProcessorList = this.context.getBeansOfType(SavingDayClosureProcessor.class)
                    .entrySet()
                    .stream()
                    .map(Map.Entry::getValue)
                    .sorted(Comparator.comparingInt(x -> x.getProcessType().getOrder()))
                    .collect(Collectors.toList());
        }

        return savingDayClosureProcessorList;
    }

    @Override
    public List<ProcessType> getContractProcessTypes(){
        return this.getProcessingServices()
                .stream()
                .filter(x -> x.getProcessType().getModuleType().equals(this.getType()))
                .map(DayClosureProcessor::getProcessType)
                .collect(Collectors.toList());
    }

    @Override
    public ModuleType getType() {
        return ModuleType.SAVINGS;
    }

    @Override
    public String getTitle() {
        return "Saving Closure Operations";
    }

    @Override
    public Integer getOrder() {
        return 3;
    }

}
