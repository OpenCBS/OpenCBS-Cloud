package com.opencbs.bonds.repositories;

import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.repositories.custom.BondEventRepositoryCustom;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.repositories.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BondEventRepository extends Repository<BondEvent>, BondEventRepositoryCustom {

    List<BondEvent> findAllByBondId(Long bondId);

    List<BondEvent> findAllByGroupKey(Long groupKey);

    List<BondEvent> findAllByBondIdAndDeletedAndEventTypeAndEffectiveAtBefore(Long bondId, boolean isDeleted, EventType eventType, LocalDateTime localDateTime);

    Optional<BondEvent> findFirstByBondIdAndDeletedFalseOrderByEffectiveAtDesc(Long bondId);
}
