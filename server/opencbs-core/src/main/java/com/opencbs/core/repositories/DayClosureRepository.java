package com.opencbs.core.repositories;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.dayClosure.DayClosure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DayClosureRepository extends JpaRepository<DayClosure, LocalDate> {
    Optional<DayClosure> findFirstByBranchAndFailedIsFalseOrderByDayDesc(Branch branch);
}