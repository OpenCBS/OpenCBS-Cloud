package com.opencbs.bonds.repositories;

import com.opencbs.bonds.domain.BondEventInstallmentAccrual;
import com.opencbs.core.domain.enums.EventType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BondEventInstallmentAccrualRepository extends JpaRepository<BondEventInstallmentAccrual, Long> {

    List<BondEventInstallmentAccrual> findByBondIdAndEventType(Long bondId, EventType eventType);
}
