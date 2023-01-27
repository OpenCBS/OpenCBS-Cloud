package com.opencbs.termdeposite.processing;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.services.operationdayservices.Container;
import com.opencbs.core.services.operationdayservices.DayClosureProcessor;
import com.opencbs.termdeposite.services.TermDepositService;
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
public class TermDepositContainer implements Container {

    private final TermDepositService termDepositService;
    private final ApplicationContext context;
    private static List<DayClosureProcessor> termDepositDayClosureProcessorList;

    @Autowired
    protected TermDepositContainer(@NonNull TermDepositService termDepositService,
                                   @NonNull ApplicationContext context) {
        this.termDepositService = termDepositService;
        this.context = context;
    }

    @Override
    public List<Long> getIdsContracts(Branch branch) {
       return termDepositService.getIdsActiveTermDeposit(branch);
    }

    @Override
    public List<DayClosureProcessor> getProcessingServices() {
        if (termDepositDayClosureProcessorList == null) {
            termDepositDayClosureProcessorList = this.context.getBeansOfType(TermDepositDayClosureProcessor.class)
                    .entrySet()
                    .stream()
                    .map(Map.Entry::getValue)
                    .sorted(Comparator.comparingInt(x -> x.getProcessType().getOrder()))
                    .collect(Collectors.toList());
        }

        return termDepositDayClosureProcessorList;
    }

    @Override
    public List<ProcessType> getContractProcessTypes() {
        return this.getProcessingServices()
                .stream()
                .filter(x -> x.getProcessType().getModuleType().equals(this.getType()))
                .map(DayClosureProcessor::getProcessType)
                .collect(Collectors.toList());
    }

    @Override
    public ModuleType getType() {
        return ModuleType.TERM_DEPOSITS;
    }

    @Override
    public String getTitle() {
        return "Term Deposit Closure Operations";
    }

    @Override
    public Integer getOrder() {
        return 4;
    }

}
