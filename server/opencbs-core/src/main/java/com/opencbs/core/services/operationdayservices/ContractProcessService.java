package com.opencbs.core.services.operationdayservices;

import com.opencbs.core.domain.User;

import java.time.LocalDate;

public interface ContractProcessService {

    void processContract(LocalDate processingDate, DayClosureProcessor process, Long contractId, User user);
}
