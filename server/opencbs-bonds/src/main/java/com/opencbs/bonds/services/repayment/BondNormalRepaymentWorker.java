package com.opencbs.bonds.services.repayment;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.domain.BondInstallment;
import com.opencbs.bonds.domain.BondRepaymentResult;
import com.opencbs.bonds.services.BondService;
import com.opencbs.bonds.workers.BondAccountingEntryWorker;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.RepaymentTypes;
import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.DateHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("unused")
public class BondNormalRepaymentWorker extends BondRepaymentBaseService implements BondRepaymentService {

    private final BondAccountingEntryWorker bondAccountingEntryWorker;

    BondNormalRepaymentWorker(BondRepaymentStoreService bondRepaymentStoreService,
                              BondService bondService,
                              BondAccountingEntryWorker bondAccountingEntryWorker) {
        super(bondRepaymentStoreService,
              bondService);
        this.bondAccountingEntryWorker = bondAccountingEntryWorker;
    }

    @Override
    protected BondRepaymentResult repayImpl(Bond bond, RepaymentSplit repaymentSplit, User currentUser, boolean persist) throws Exception {
        List<BondInstallment> installments = this
                .bondService.getInstallmentsByBond(bond);

        List<BondInstallment> unpaidInstallments = this.getUnpaidInstallments(installments);
        Set<Integer> affectedNumbers = new HashSet<>();
        List<BondEvent> events = new ArrayList<>();
        List<AccountingEntry> accountingEntries = new ArrayList<>();
        if (unpaidInstallments.size() == 0) {
            return new BondRepaymentResult(installments, affectedNumbers, events, accountingEntries);
        }
        BondInstallment firstUnpaidInstallment = unpaidInstallments.get(0);
        repaymentSplit.setTimestamp(firstUnpaidInstallment.getMaturityDate().atTime(DateHelper.getLocalTimeNow()));
        BigDecimal interest = firstUnpaidInstallment.getAccruedInterest();
        BigDecimal principal = firstUnpaidInstallment.getPrincipal();
        firstUnpaidInstallment.setPaidInterest(interest);
        firstUnpaidInstallment.setPaidPrincipal(principal);

        if (principal.compareTo(BigDecimal.ZERO) != 0) {
            BondEvent event = this.getRepaymentOfPrincipalEvent(firstUnpaidInstallment.getNumber(), principal);
            affectedNumbers.add(firstUnpaidInstallment.getNumber());
            event.setBondId(bond.getId());
            event.setCreatedById(currentUser.getId());
            event.setEffectiveAt(repaymentSplit.getTimestamp());
            List<AccountingEntry> repaymentOfPrincipalAccountingEntry = this.bondAccountingEntryWorker.getPrincipalRepaymentAccountingEntry(event);
            event.setAccountingEntry(repaymentOfPrincipalAccountingEntry);
            events.add(event);
            accountingEntries.addAll(repaymentOfPrincipalAccountingEntry);
        }

        BondEvent event = this.getRepaymentOfInterestEvent(firstUnpaidInstallment.getNumber(), interest);
        affectedNumbers.add(firstUnpaidInstallment.getNumber());
        event.setBondId(bond.getId());
        event.setCreatedById(currentUser.getId());
        event.setEffectiveAt(repaymentSplit.getTimestamp());
        List<AccountingEntry>  repaymentOfInterestAccountingEntry = this.bondAccountingEntryWorker.getInterestRepaymentAccountingEntry(event);
        event.setAccountingEntry(repaymentOfInterestAccountingEntry);
        events.add(event);
        accountingEntries.addAll(repaymentOfInterestAccountingEntry);
        return new BondRepaymentResult(installments, affectedNumbers, events, accountingEntries);
    }

    @Override
    public RepaymentSplit split(Bond bond, RepaymentSplit repaymentSplit, User currentUser) {
        List<BondInstallment> installments = this
                .bondService.getInstallmentsByBond(bond);
        List<BondInstallment> unpaidInstallments = this.getUnpaidInstallments(installments);
        if (unpaidInstallments.size() == 0)
            return repaymentSplit;

        BondInstallment firstUnpaidInstallment = unpaidInstallments.get(0);
        BigDecimal accruedInterest = firstUnpaidInstallment.getAccruedInterest();
        BigDecimal principal = firstUnpaidInstallment.getPrincipal();

        if (DateHelper.greater(firstUnpaidInstallment.getMaturityDate(), DateHelper.getLocalDateNow())) {
            repaymentSplit.setTimestamp(firstUnpaidInstallment.getMaturityDate().atTime(DateHelper.getLocalTimeNow()));
            return repaymentSplit;
        }
        if (DateHelper.lessOrEqual(firstUnpaidInstallment.getMaturityDate(), DateHelper.getLocalDateNow())){
            repaymentSplit.setTimestamp(firstUnpaidInstallment.getMaturityDate().atTime(DateHelper.getLocalTimeNow()));
            repaymentSplit.setInterest(accruedInterest);
            repaymentSplit.setPrincipal(principal);
            repaymentSplit.setTotal(accruedInterest.add(principal));
            return repaymentSplit;
        }
        return repaymentSplit;
    }

    @Override
    public RepaymentTypes getType() {
        return RepaymentTypes.NORMAL_REPAYMENT;
    }

    private List<BondInstallment> getUnpaidInstallments(List<BondInstallment> installments) {
        List<BondInstallment> unpaidInstallments = installments
                .stream()
                .filter(x -> !x.isPaid())
                .collect(Collectors.toList());
        return unpaidInstallments;
    }
}
