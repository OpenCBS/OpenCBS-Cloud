package com.opencbs.core.services.impl;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.dayClosure.DayClosure;
import com.opencbs.core.repositories.DayClosureRepository;
import com.opencbs.core.services.DayClosureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DayClosureServiceImpl implements DayClosureService {

    private final DayClosureRepository dayClosureRepository;

    @Autowired
    public DayClosureServiceImpl(DayClosureRepository dayClosureRepository) {
        this.dayClosureRepository = dayClosureRepository;
    }

    @Override
    public DayClosure createDayClosure(LocalDate date, LocalDateTime startDateTime, LocalDateTime endDateTime,
                                       LocalDateTime launchTime, String exceptionMessage, Branch branch) {
        DayClosure dayClosure = new DayClosure();
        dayClosure.setDay(date);
        dayClosure.setStartTime(startDateTime);
        dayClosure.setEndTime(endDateTime);
        dayClosure.setErrorMessage(exceptionMessage);
        dayClosure.setFailed(!StringUtils.isEmpty(exceptionMessage));
        dayClosure.setMainProcess(startDateTime.isEqual(launchTime));
        dayClosure.setBranch(branch);
        return this.dayClosureRepository.save(dayClosure);
    }

    @Override
    public List<DayClosure> getAll() {
        return dayClosureRepository.findAll();
    }

    @Override
    public Optional<DayClosure> getLastSuccessfulDayClosureByBranch(Branch branch) {
        return dayClosureRepository.findFirstByBranchAndFailedIsFalseOrderByDayDesc(branch);
    }
}
