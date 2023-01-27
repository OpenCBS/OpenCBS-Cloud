package com.opencbs.core.services.operationdayservices;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.domain.enums.ProcessStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface ProcessService {
    String getTitle();

    ProcessStatus getStatus();

    double getPercentage();

    void setPercentage(double progress);

    void run(LocalDateTime date, User user) throws Exception;

    void processingOneContract(Long contractId, LocalDate date, User user);

    ProcessType getDayClosureContainerType();

    void setCallBackMessage(ProgressBarMessages callBackFunction);
}
