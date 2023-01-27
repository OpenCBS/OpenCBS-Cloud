package com.opencbs.bonds.services.repayment;

import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.domain.BondInstallment;
import com.opencbs.bonds.domain.BondRepaymentResult;
import com.opencbs.bonds.domain.enums.BondStatus;
import com.opencbs.bonds.services.BondEventGroupKeyService;
import com.opencbs.bonds.services.BondEventService;
import com.opencbs.bonds.services.BondInstallmentService;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Service
public class BondRepaymentStoreService {

    private final BondInstallmentService bondInstallmentService;
    private final BondEventGroupKeyService bondEventGroupKeyService;
    private final BondEventService bondEventService;
    private final BranchService branchService;
    private final AccountingEntryService accountingEntryService;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    BondRepaymentStoreService(
            BondInstallmentService bondInstallmentService,
            BondEventGroupKeyService bondEventGroupKeyService,
            BondEventService bondEventService,
            BranchService branchService,
            AccountingEntryService accountingEntryService) {
        this.bondInstallmentService = bondInstallmentService;
        this.bondEventGroupKeyService = bondEventGroupKeyService;
        this.bondEventService = bondEventService;
        this.branchService = branchService;
        this.accountingEntryService = accountingEntryService;
    }

    @Transactional(isolation = Isolation.READ_UNCOMMITTED)
    public void save(BondRepaymentResult result) {
        result.getInstallments().forEach(x -> entityManager.detach(x));
        LocalDateTime now = DateHelper.getLocalDateTimeNow();
        Long groupKey = this.bondEventGroupKeyService.getNextBondEventGroupKey();

        result.getInstallments()
                .stream()
                .filter(i -> result.getAffectedNumbers().contains(i.getNumber()))
                .map(BondInstallment::new)
                .forEach(installment -> {
                    installment.setEventGroupKey(groupKey);
                    installment.setEffectiveAt(result.getTimestamp());
                    installment.setBond(result.getBond());
                    installment.setRescheduled(false);
                    this.bondInstallmentService.save(installment);
                });

        HashMap<BondEvent, List<AccountingEntry>> bondAccountingEntries = new HashMap<>();
        this.setNullAccountingEntries(result.getEvents(), bondAccountingEntries);
        this.saveBondEvents(result.getEvents(), groupKey);
        this.saveAccountingEntries(result.getAccountingEntries(), result.getCurrentUser(), result.getBond().getId());
        this.addAccountingEntriesBondEvents(result.getEvents(), bondAccountingEntries);

        boolean bondRepaid = result.getInstallments()
                .parallelStream()
                .filter(installment -> installment.getPrincipal().compareTo(BigDecimal.ZERO) > 0)
                .map(BondInstallment::isPaid)
                .findFirst().orElse(false);

        if (!bondRepaid) return;

        BondEvent closingEvent = new BondEvent();
        closingEvent.setEventType(EventType.CLOSED);
        closingEvent.setCreatedAt(now);
        closingEvent.setCreatedById(result.getCurrentUser().getId());
        closingEvent.setGroupKey(groupKey + 1);
        closingEvent.setEffectiveAt(result.getTimestamp());
        closingEvent.setBondId(result.getBond().getId());
        closingEvent.setAmount(BigDecimal.ZERO);
        result.getBond().setStatus(BondStatus.CLOSED);

        this.bondEventService.save(closingEvent);
    }

    private void addAccountingEntriesBondEvents(List<BondEvent> events, HashMap<BondEvent, List<AccountingEntry>> bondAccountingEntries) {
        for (BondEvent bondEvent : events){
            List<AccountingEntry> accountingEntries = bondAccountingEntries.get(bondEvent);
            bondEvent.setAccountingEntry(accountingEntries);
            this.bondEventService.save(bondEvent);
        }
    }

    private void saveAccountingEntries(List<AccountingEntry> accountingEntries, User currentUser, Long id) {
        Branch branch = this.branchService.findAll().stream().findFirst().orElse(null);
        for (AccountingEntry accountingEntry : accountingEntries) {
            accountingEntry.setCreatedBy(currentUser);
            accountingEntry.setCreatedAt(LocalDateTime.now());
            accountingEntry.setBranch(branch);
            this.accountingEntryService.create(accountingEntry);
        }
    }

    private void saveBondEvents(List<BondEvent> events, Long groupKey) {
        for (BondEvent bondEvent : events) {
            bondEvent.setGroupKey(groupKey);
            this.bondEventService.save(bondEvent);
        }
    }

    private void setNullAccountingEntries(List<BondEvent> events, HashMap<BondEvent, List<AccountingEntry>> bondAccountingEntries) {
        for (BondEvent bondEvent : events){
            bondAccountingEntries.put(bondEvent, bondEvent.getAccountingEntry());
            bondEvent.setAccountingEntry(null);
        }
    }
}
