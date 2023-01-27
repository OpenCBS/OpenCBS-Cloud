package com.opencbs.core.services.operationdayservices.impl;

import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.operationdayservices.ContractProcessService;
import com.opencbs.core.services.operationdayservices.DayClosureProcessor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Service
public class ContractProcessServiceImpl implements ContractProcessService {

    private final DayClosureContractService dayClosureContractService;

    @Autowired
    public ContractProcessServiceImpl(@NonNull DayClosureContractService dayClosureContractService) {
        this.dayClosureContractService = dayClosureContractService;
    }

    @Transactional
    public void processContract(LocalDate processingDate, DayClosureProcessor process, Long contractId, User user) {
        if (contractWasProcessed(contractId, processingDate, process.getProcessType())) {
            return;
        }

        process.processContract(contractId, processingDate, user);
        dayClosureContractService.updateDayClosureContract(contractId, process.getProcessType(), processingDate, user.getBranch());
    }

    private boolean contractWasProcessed(@NonNull Long contractId, @NonNull LocalDate date, ProcessType processingType) {
        LocalDate lastProcessingDate = dayClosureContractService.getLastRunDay(contractId, processingType);
        return DateHelper.greaterOrEqual(lastProcessingDate, date);
    }
}
