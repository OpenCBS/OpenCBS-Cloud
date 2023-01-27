package com.opencbs.bonds.services.impl;

import com.opencbs.bonds.domain.BondEventInstallmentAccrual;
import com.opencbs.bonds.repositories.BondEventInstallmentAccrualRepository;
import com.opencbs.bonds.services.BondEventInstallmentAccrualService;
import com.opencbs.core.domain.enums.EventType;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BondEventInstallmentAccrualServiceImpl implements BondEventInstallmentAccrualService {

    private final BondEventInstallmentAccrualRepository repository;


    @Override
    public List<BondEventInstallmentAccrual> getBondEvents(@NonNull Long bondId, @NonNull EventType eventType) {
        return repository.findByBondIdAndEventType(bondId, eventType);
    }
}
