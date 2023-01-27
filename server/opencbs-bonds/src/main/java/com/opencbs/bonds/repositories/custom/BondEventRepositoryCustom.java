package com.opencbs.bonds.repositories.custom;

import com.opencbs.bonds.domain.BondEvent;

import java.time.LocalDateTime;
import java.util.List;

public interface BondEventRepositoryCustom {
    List<BondEvent> findAllByBondIdAndEffectiveAt(Long bondId, LocalDateTime from, LocalDateTime to);
}
