package com.opencbs.bonds.workers;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.services.BondEventGroupKeyService;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.UserService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class BondEventWorker {

    private final BondEventGroupKeyService bondEventGroupKeyService;

    private final UserService userService;


    @Autowired
    public BondEventWorker(@NonNull BondEventGroupKeyService bondEventGroupKeyService,
                           @NonNull UserService userService) {
        this.bondEventGroupKeyService = bondEventGroupKeyService;
        this.userService = userService;
    }

    public BondEvent getStartBondEvent(Bond bond){
        BondEvent bondEvent = new BondEvent();
        bondEvent.setEventType(EventType.SELL);
        bondEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        bondEvent.setCreatedById(userService.getCurrentUser().getId());
        bondEvent.setEffectiveAt(LocalDateTime.of(bond.getSellDate(), DateHelper.getLocalTimeNow()));
        bondEvent.setGroupKey(this.bondEventGroupKeyService.getNextBondEventGroupKey());
        bondEvent.setAmount(bond.getEquivalentAmount());
        bondEvent.setBondId(bond.getId());
        return bondEvent;
    }

    public BondEvent getValueDateEvent(Bond bond, LocalDate valueDate){
        BondEvent bondEvent = new BondEvent();
        bondEvent.setEventType(EventType.BOND_VALUE_DATE);
        bondEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        bondEvent.setCreatedById(userService.getCurrentUser().getId());
        bondEvent.setEffectiveAt(LocalDateTime.of(valueDate, DateHelper.getLocalTimeNow()));
        bondEvent.setGroupKey(this.bondEventGroupKeyService.getNextBondEventGroupKey());
        bondEvent.setAmount(bond.getEquivalentAmount());
        bondEvent.setBondId(bond.getId());
        return bondEvent;
    }
}
