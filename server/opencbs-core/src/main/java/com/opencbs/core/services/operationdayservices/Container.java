package com.opencbs.core.services.operationdayservices;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.enums.ProcessType;

import java.util.List;

public interface Container {

    List<Long> getIdsContracts(Branch branch);

    List<DayClosureProcessor> getProcessingServices();

    List<ProcessType> getContractProcessTypes();

    ModuleType getType();

    String getTitle();

    Integer getOrder();

}
