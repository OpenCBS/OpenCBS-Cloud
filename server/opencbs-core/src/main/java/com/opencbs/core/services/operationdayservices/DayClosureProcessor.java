package com.opencbs.core.services.operationdayservices;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ProcessType;

import java.time.LocalDate;

public interface DayClosureProcessor<T> {

    void processContract(Long contractId, LocalDate closureDate, User user);

    ProcessType getProcessType();

    /***
     * Must be return unique identificator in global context.
     * Recommendations: "MODULE NAME/TYPE (dot) PROCESSING NAME/TYPE"
     */
    String getIdentityString();
}
