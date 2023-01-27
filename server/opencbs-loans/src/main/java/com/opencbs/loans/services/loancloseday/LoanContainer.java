package com.opencbs.loans.services.loancloseday;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.services.operationdayservices.Container;
import com.opencbs.core.services.operationdayservices.DayClosureProcessor;
import com.opencbs.loans.services.LoanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoanContainer implements Container {

    private final LoanService loanService;
    private final ApplicationContext context;
    private static List<DayClosureProcessor> loanDayClosureProcessorList;


    @Override
    public List<Long> getIdsContracts(Branch branch) {
        return this.loanService.getActiveLoanIds(branch);
    }

    @Override
    public List<DayClosureProcessor> getProcessingServices() {
        if (loanDayClosureProcessorList == null) {
            loanDayClosureProcessorList = this.context.getBeansOfType(LoanDayClosureProcessor.class)
                    .entrySet()
                    .stream()
                    .map(Map.Entry::getValue)
                    .sorted(Comparator.comparingInt(x -> x.getProcessType().getOrder()))
                    .collect(Collectors.toList());
        }

        return loanDayClosureProcessorList;
    }

    public List<ProcessType> getContractProcessTypes(){
        return this.getProcessingServices()
                .stream()
                .filter(x -> x.getProcessType().getModuleType().equals(this.getType()))
                .map(DayClosureProcessor::getProcessType)
                .collect(Collectors.toList());
    }

    @Override
    public ModuleType getType() {
        return ModuleType.LOANS;
    }

    @Override
    public String getTitle() {
        return "Loan Closure Operations";
    }

    @Override
    public Integer getOrder() {
        return 1;
    }

}
