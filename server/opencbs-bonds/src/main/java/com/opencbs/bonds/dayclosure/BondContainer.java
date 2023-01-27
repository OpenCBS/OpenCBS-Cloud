package com.opencbs.bonds.dayclosure;

import com.opencbs.bonds.services.BondService;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.services.operationdayservices.Container;
import com.opencbs.core.services.operationdayservices.DayClosureProcessor;
import lombok.NonNull;
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
public class BondContainer implements Container {

    private final BondService bondService;
    private final ApplicationContext context;
    private static List<DayClosureProcessor> bondDayClosureProcessorList;

    @Autowired
    protected BondContainer(@NonNull BondService bondService,
                            @NonNull ApplicationContext context) {
        this.bondService = bondService;
        this.context = context;
    }

    @Override
    public List<Long> getIdsContracts(Branch branch) {
       return bondService.getActiveBondIds(branch);
    }

    @Override
    public List<DayClosureProcessor> getProcessingServices() {
        if (bondDayClosureProcessorList == null) {
            bondDayClosureProcessorList = this.context.getBeansOfType(BondDayClosureProcessor.class)
                    .entrySet()
                    .stream()
                    .map(Map.Entry::getValue)
                    .sorted(Comparator.comparingInt(x -> x.getProcessType().getOrder()))
                    .collect(Collectors.toList());
        }

        return bondDayClosureProcessorList;
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
        return ModuleType.BONDS;
    }

    @Override
    public String getTitle() {
        return "Bond Closure Operations";
    }

    @Override
    public Integer getOrder() {
        return 5;
    }

}
