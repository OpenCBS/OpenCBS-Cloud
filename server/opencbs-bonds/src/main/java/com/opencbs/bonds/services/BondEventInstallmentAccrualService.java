package com.opencbs.bonds.services;

import com.opencbs.bonds.domain.BondEventInstallmentAccrual;
import com.opencbs.core.domain.enums.EventType;

import java.util.List;

public interface BondEventInstallmentAccrualService {

    List<BondEventInstallmentAccrual> getBondEvents(Long bondId, EventType eventType);
}
