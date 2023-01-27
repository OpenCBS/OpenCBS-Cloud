package com.opencbs.core.dayclosure.contract;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.dayClosure.DayClosureActualContract;
import com.opencbs.core.domain.dayClosure.DayClosureContract;
import com.opencbs.core.domain.enums.ProcessType;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DayClosureContractService {

    private final DayClosureContractRepository dayClosureContractRepository;
    private final DayClosureActualContractRepository dayClosureActualContractRepository;


    public void updateDayClosureContract(@NonNull Long contractId, ProcessType processType, LocalDate date, Branch branch) {
        DayClosureContract dayClosureContract = dayClosureContractRepository.findByContractIdAndProcessType(contractId, processType);

        if (dayClosureContract == null) {
            dayClosureContract = new DayClosureContract();
            dayClosureContract.setContractId(contractId);
            dayClosureContract.setProcessType(processType);
        }

        dayClosureContract.setActualDate(date);
        dayClosureContract.setBranch(branch);

        dayClosureContractRepository.save(dayClosureContract);
    }

    public LocalDate getLastRunDay(Long id, ProcessType processType) {
        Optional<DayClosureActualContract> dayClosureContract = dayClosureActualContractRepository.findByContractIdAndProcessType(id, processType);

        if (dayClosureContract.isPresent() && dayClosureContract.get().getActualDate() != null) {
            return dayClosureContract.get().getActualDate();
        }

        throw new RuntimeException(String.format("Actual date for %s and ID %s not found", processType, id));
    }

    public DayClosureContract findByContractIdAndProcessType(Long contractId, ProcessType processType) {
        return this.dayClosureContractRepository.findByContractIdAndProcessType(contractId, processType);
    }

    public List<DayClosureContract> findByContractIdAndProcessTypes(Long contractId, List<ProcessType> processTypes) {
        return this.dayClosureContractRepository.findByContractIdAndProcessTypeIn(contractId, processTypes);
    }

    public void save(DayClosureContract dayClosureContract) {
        dayClosureContractRepository.save(dayClosureContract);
    }
}
