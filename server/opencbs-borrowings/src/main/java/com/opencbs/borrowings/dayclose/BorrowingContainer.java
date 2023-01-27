package com.opencbs.borrowings.dayclose;

import com.opencbs.borrowings.services.BorrowingService;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.services.operationdayservices.Container;
import com.opencbs.core.services.operationdayservices.DayClosureProcessor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BorrowingContainer implements Container {

    private final ApplicationContext context;
    private final BorrowingService borrowingService;
    private static List<DayClosureProcessor> borrowingDayClosureProcessorList;

    public BorrowingContainer(ApplicationContext context, BorrowingService borrowingService) {
        this.context = context;
        this.borrowingService = borrowingService;
    }

    @Override
    public List<Long> getIdsContracts(Branch branch) {
        return this.borrowingService.getActiveBorrowingIds(branch);
    }

    @Override
    public List<DayClosureProcessor> getProcessingServices() {
        if (borrowingDayClosureProcessorList == null) {
            borrowingDayClosureProcessorList = this.context.getBeansOfType(BorrowingDayClosureProcessor.class)
                    .entrySet()
                    .stream()
                    .map(Map.Entry::getValue)
                    .sorted(Comparator.comparingInt(x -> x.getProcessType().getOrder()))
                    .collect(Collectors.toList());
        }

        return borrowingDayClosureProcessorList;
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
        return ModuleType.BORROWINGS;
    }

    @Override
    public String getTitle() {
        return "Borrowings Closure Operations";
    }

    @Override
    public Integer getOrder() {
        return 2;
    }

}
