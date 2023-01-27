package com.opencbs.core.helpers;

import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.dayClosure.DayClosureContract;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.services.operationdayservices.DayClosureProcessor;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ActualizeHelper implements ApplicationContextAware {

    private static DayClosureContractService dayClosureContractService;
    private static ApplicationContext context;

    @Autowired
    public ActualizeHelper(DayClosureContractService dayClosureContractService) {
        ActualizeHelper.dayClosureContractService = dayClosureContractService;
    }

    public static void isActualized(Long contractId, ModuleType moduleType, LocalDate date) {
        List<ProcessType> allProcesses = context.getBeansOfType(DayClosureProcessor.class)
                .entrySet()
                .stream()
                .map(Map.Entry::getValue)
                .filter(processType -> moduleType.equals(processType.getProcessType().getModuleType()))
                .map(DayClosureProcessor::getProcessType)
                .collect(Collectors.toList());

        for (ProcessType processType : allProcesses) {
            LocalDate actualDate = dayClosureContractService.getLastRunDay(contractId, processType);
            if (DateHelper.greater(date, actualDate)) {
                throw new RuntimeException(String.format("You have to actualize contract (ID = %d)", contractId));
            }
        }
    }

    public static LocalDate getLastActualizeDate(Long contractId, ModuleType moduleType) {
        List<ProcessType> allProcesses = context.getBeansOfType(DayClosureProcessor.class)
                .entrySet()
                .stream()
                .map(Map.Entry::getValue)
                .filter(processType -> moduleType.equals(processType.getProcessType().getModuleType()))
                .map(DayClosureProcessor::getProcessType)
                .collect(Collectors.toList());

        return dayClosureContractService.findByContractIdAndProcessTypes(contractId, allProcesses)
                .stream()
                .min(Comparator.comparing(DayClosureContract::getActualDate))
                .get().getActualDate();
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        context = applicationContext;
    }
}
