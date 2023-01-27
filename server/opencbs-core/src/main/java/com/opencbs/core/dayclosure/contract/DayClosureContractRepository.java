package com.opencbs.core.dayclosure.contract;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.dayClosure.DayClosureContract;
import com.opencbs.core.domain.enums.ProcessType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface DayClosureContractRepository extends JpaRepository<DayClosureContract, LocalDate> {

    DayClosureContract findByContractIdAndProcessType(Long contractId, ProcessType processType);
    List<DayClosureContract> findByContractIdAndProcessTypeIn(Long contractId, List<ProcessType> processTypes);
    Optional<DayClosureContract> findFirstByBranchAndActualDateBefore(Branch branch, LocalDate date);
    List<DayClosureContract> findByBranchAndProcessTypeInAndContractIdIn(Branch branch,
                                                                         Collection<ProcessType> processTypes,
                                                                         Collection<Long> ids);
    void deleteAllByContractIdAndProcessType(Long loanId, ProcessType processType);
}