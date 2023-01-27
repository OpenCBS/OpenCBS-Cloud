package com.opencbs.bonds.workers;

import com.opencbs.bonds.dayclosure.BondContainer;
import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.domain.enums.BondStatus;
import com.opencbs.bonds.services.BondEventService;
import com.opencbs.bonds.services.BondInstallmentService;
import com.opencbs.bonds.services.BondService;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.DateHelper;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class BondWorker {

    private final BondAccountWorker bondAccountWorker;
    private final BondService bondService;
    private final BondEventWorker bondEventWorker;
    private final BondEventService bondEventService;
    private final BondAccountingEntryWorker bondAccountingEntryWorker;
    private final AccountingEntryService accountingEntryService;
    private final DayClosureContractService dayClosureContractService;
    private final BondInstallmentService bondInstallmentService;
    private final BondContainer bondContainer;

    @Autowired
    public BondWorker(BondAccountWorker bondAccountWorker,
                      BondService bondService,
                      BondEventWorker bondEventWorker,
                      BondEventService bondEventService,
                      BondAccountingEntryWorker bondAccountingEntryWorker,
                      AccountingEntryService accountingEntryService,
                      DayClosureContractService dayClosureContractService,
                      BondInstallmentService bondInstallmentService,
                      BondContainer bondContainer) {
        this.bondAccountWorker = bondAccountWorker;
        this.bondService = bondService;
        this.bondEventWorker = bondEventWorker;
        this.bondEventService = bondEventService;
        this.bondAccountingEntryWorker = bondAccountingEntryWorker;
        this.accountingEntryService = accountingEntryService;
        this.dayClosureContractService = dayClosureContractService;
        this.bondInstallmentService = bondInstallmentService;
        this.bondContainer = bondContainer;
    }

    @Transactional
    public Bond start(Bond bond) {
        this.checkStatus(bond);
        if (bond.getBondAccounts().isEmpty()) {
            bond.setBondAccounts(this.bondAccountWorker.createBondAccounts(bond));
        }
        bond.setStatus(BondStatus.SOLD);
        BondEvent sellEvent = this.bondEventWorker.getStartBondEvent(bond);
        this.bondEventService.save(sellEvent);
        this.updateBondScheduleAfterSell(bond, sellEvent);
        this.bondService.save(bond);
        this.updateDayClosureContract(bond, sellEvent.getEffectiveAt().toLocalDate(), bond.getBranch());

        return bond;
    }

    private void updateBondScheduleAfterSell(Bond bond, BondEvent sellEvent) {
        this.bondInstallmentService.findAllByBondId(bond.getId())
                .stream()
                .forEach(bondInstallment -> {
                    bondInstallment.setEffectiveAt(sellEvent.getEffectiveAt());
                    bondInstallment.setEventGroupKey(sellEvent.getGroupKey());
                    bondInstallment.setDeleted(false);
                });
    }

    private void updateDayClosureContract(Bond bond, LocalDate date, Branch branch) {
        for (ProcessType containerType : this.bondContainer.getContractProcessTypes()) {
            this.dayClosureContractService.updateDayClosureContract(bond.getId(), containerType, date, branch);
        }
    }

    private void checkStatus(Bond bond) {
        if (!BondStatus.IN_PROGRESS.equals(bond.getStatus())) {
            throw new RuntimeException("Bond has to be in progress");
        }
    }

    @Transactional
    public Bond setValueDate(@NonNull Bond bond, @NonNull LocalDate valueDate) {
        if (!bond.getStatus().equals(BondStatus.SOLD)) {
            throw new RuntimeException("Bond has to be started");
        }

        if (DateHelper.greater(bond.getSellDate(), valueDate)) {
            throw new RuntimeException("Value Date can't be before Start Date");
        }

        BondEvent sellEvent = this.bondEventWorker.getValueDateEvent(bond, valueDate);

        AccountingEntry sellAccountingEntry = this.bondAccountingEntryWorker.createValueDateBondAccountingEntry(sellEvent);
        sellAccountingEntry = this.accountingEntryService.create(sellAccountingEntry);
        sellEvent.getAccountingEntry().add(sellAccountingEntry);
        this.bondEventService.save(sellEvent);

        bond.setValueDate(valueDate);
        return this.bondService.save(bond);
    }
}
