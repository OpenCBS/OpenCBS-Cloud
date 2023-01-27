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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("unused")
public class BondEarlyTotalRepaymentWorker extends BondRepaymentBaseService implements BondRepaymentService {

    private final BondAccountingEntryWorker bondAccountingEntryWorker;

    BondEarlyTotalRepaymentWorker(BondRepaymentStoreService bondRepaymentStoreService,
                                  BondService bondService,
                                  BondAccountingEntryWorker bondAccountingEntryWorker) {
        super(bondRepaymentStoreService, bondService);
        this.bondAccountingEntryWorker = bondAccountingEntryWorker;
    }

    @Override
    protected BondRepaymentResult repayImpl(Bond bond, RepaymentSplit repaymentSplit, User currentUser, boolean persist) throws Exception {
        List<BondInstallment> installments = this
                .bondService.getInstallmentsByBond(bond);

        Set<Integer> affectedNumbers = new HashSet<>();
        List<BondEvent> events = new ArrayList<>();
        List<AccountingEntry> accountingEntries = new ArrayList<>();

        BondInstallment firstUnpaidInstallment = this.getUnpaidInstallments(installments).get(0);
        repaymentSplit.setTimestamp(firstUnpaidInstallment.getMaturityDate().atTime(DateHelper.getLocalTimeNow()));
        BondInstallment lastInstallment = installments.get(installments.size() - 1);
        BigDecimal accruedInterest = firstUnpaidInstallment.getAccruedInterest();
        BigDecimal penalty = this.getPenalty(lastInstallment, bond);
        BigDecimal principal = lastInstallment.getPrincipal().subtract(penalty);

        firstUnpaidInstallment.setInterest(accruedInterest);
        firstUnpaidInstallment.setPrincipal(principal);
        firstUnpaidInstallment.setPaidInterest(accruedInterest);
        firstUnpaidInstallment.setPaidPrincipal(principal);

        if(!firstUnpaidInstallment.equals(lastInstallment)){
            lastInstallment.setPrincipal(BigDecimal.ZERO);
        }

        BondEvent interestEvent = this.getRepaymentOfInterestEvent(firstUnpaidInstallment.getNumber(), accruedInterest);
        if (!interestEvent.getAmount().equals(BigDecimal.ZERO)) {
            this.setAdditionalParametersToBondEvent(interestEvent, bond.getId(), currentUser.getId(), repaymentSplit.getTimestamp());
            affectedNumbers.add(firstUnpaidInstallment.getNumber());
            interestEvent.setAccountingEntry(this.bondAccountingEntryWorker.getInterestRepaymentAccountingEntry(interestEvent));
            events.add(interestEvent);
            accountingEntries.addAll(interestEvent.getAccountingEntry());
        }

        BondEvent principalEvent = this.getRepaymentOfPrincipalEvent(firstUnpaidInstallment.getNumber(), principal);
        this.setAdditionalParametersToBondEvent(principalEvent, bond.getId(), currentUser.getId(), repaymentSplit.getTimestamp());
        affectedNumbers.add(firstUnpaidInstallment.getNumber());
        principalEvent.setAccountingEntry(this.bondAccountingEntryWorker.getPrincipalRepaymentAccountingEntry(principalEvent));
        events.add(principalEvent);
        accountingEntries.addAll(principalEvent.getAccountingEntry());

        BondEvent penaltyEvent = this.getRepaymentOfPenaltyEvent(firstUnpaidInstallment.getNumber(), penalty);
        if(!penaltyEvent.getAmount().equals(BigDecimal.ZERO)) {
            this.setAdditionalParametersToBondEvent(penaltyEvent, bond.getId(), currentUser.getId(), repaymentSplit.getTimestamp());
            affectedNumbers.add(firstUnpaidInstallment.getNumber());
            penaltyEvent.setAccountingEntry(this.bondAccountingEntryWorker.getBondPenaltyAccountingEntry(penaltyEvent));
            events.add(penaltyEvent);
            accountingEntries.addAll(penaltyEvent.getAccountingEntry());
        }

        installments.stream()
                .filter(installment -> !installment.isPaid())
                .forEach(installment -> {
                    affectedNumbers.add(installment.getNumber());
                    installment.setPrincipal(BigDecimal.ZERO);
                    installment.setInterest(BigDecimal.ZERO);
                });

        return new BondRepaymentResult(installments, affectedNumbers, events, accountingEntries);
    }

    @Override
    public RepaymentSplit split(Bond bond, RepaymentSplit repaymentSplit, User currentUser) {
        List<BondInstallment> installments = this
                .bondService.getInstallmentsByBond(bond);
        List<BondInstallment> unpaidInstallments = this.getUnpaidInstallments(installments);

        if (unpaidInstallments.size() == 0)
            return repaymentSplit;

        BondInstallment firstUnpaidInstallment = unpaidInstallments.stream().findFirst().get();
        BondInstallment lastInstallment = unpaidInstallments.get(unpaidInstallments.size() - 1);

        BigDecimal interest = firstUnpaidInstallment.getAccruedInterest();
        BigDecimal principal = lastInstallment.getPrincipal();
        BigDecimal penalty = this.getPenalty(lastInstallment, bond);
        BigDecimal total = principal.subtract(penalty).add(interest);

        repaymentSplit.setTimestamp(DateHelper.getLocalDateTimeNow());
        repaymentSplit.setInterest(interest);
        repaymentSplit.setPrincipal(lastInstallment.getPrincipal());
        repaymentSplit.setPenalty(penalty);
        repaymentSplit.setTotal(total);
        return repaymentSplit;
    }

    @Override
    public RepaymentTypes getType() {
        return RepaymentTypes.EARLY_TOTAL_REPAYMENT;
    }

    private BigDecimal getPenalty(BondInstallment installment, Bond bond) {
        return installment.getPrincipal()
                .multiply(bond.getPenaltyRate()
                        .divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP));
    }

    private List<BondInstallment> getUnpaidInstallments(List<BondInstallment> installments) {
        List<BondInstallment> unpaidInstallments = installments
                .stream()
                .filter(x -> !x.isPaid())
                .collect(Collectors.toList());
        return unpaidInstallments;
    }

    private void setAdditionalParametersToBondEvent(BondEvent bondEvent, Long bondId, Long userId, LocalDateTime effectiveAt) {
        bondEvent.setBondId(bondId);
        bondEvent.setCreatedById(userId);
        bondEvent.setEffectiveAt(effectiveAt);
    }
}
