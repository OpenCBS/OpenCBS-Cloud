package com.opencbs.core.services;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.dayClosure.DayClosure;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DayClosureService {

    DayClosure createDayClosure(LocalDate day, LocalDateTime start, LocalDateTime end, LocalDateTime launchTime, String exceptionMessage, Branch branch);

    Optional<DayClosure> getLastSuccessfulDayClosureByBranch(Branch branch);

    List<DayClosure> getAll();
}
