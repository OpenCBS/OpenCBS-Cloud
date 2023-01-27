package com.opencbs.core.dayclosure.contract;

import com.opencbs.core.domain.dayClosure.DayClosureActualContract;
import com.opencbs.core.domain.enums.ProcessType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DayClosureActualContractRepository extends JpaRepository<DayClosureActualContract, Long> {

    Optional<DayClosureActualContract> findByContractIdAndProcessType(Long contractId, ProcessType processType);
}
