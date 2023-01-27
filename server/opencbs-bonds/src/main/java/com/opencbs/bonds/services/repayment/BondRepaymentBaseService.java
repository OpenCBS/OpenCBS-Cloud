package com.opencbs.bonds.services.repayment;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.domain.BondInstallment;
import com.opencbs.bonds.domain.BondRepaymentResult;
import com.opencbs.bonds.services.BondService;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.helpers.DateHelper;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

abstract class BondRepaymentBaseService {
    private final BondRepaymentStoreService bondRepaymentStoreService;
    protected final BondService bondService;

    BondRepaymentBaseService(
            BondRepaymentStoreService bondRepaymentStoreService,
            BondService bondService) {
        this.bondRepaymentStoreService = bondRepaymentStoreService;
        this.bondService = bondService;
    }

    public List<BondInstallment> preview(Bond bond, RepaymentSplit repaymentSplit, User currentUser) throws Exception {
        BondRepaymentResult result = this.repayImpl(bond, repaymentSplit, currentUser, false);
        return result.getInstallments();
    }

    @Transactional
    public void repay(Bond bond, RepaymentSplit repaymentSplit, User currentUser) throws Exception {
        BondRepaymentResult result = this.repayImpl(bond, repaymentSplit, currentUser, true);
        result.setBond(bond);
        result.setCurrentUser(currentUser);
        result.setTimestamp(repaymentSplit.getTimestamp());
        this.bondRepaymentStoreService.save(result);
    }

    protected abstract BondRepaymentResult repayImpl(Bond bond, RepaymentSplit repaymentSplit, User currentUser, boolean persist) throws Exception;

    protected BondEvent getRepaymentOfInterestEvent(Integer installmentNumber, BigDecimal amount) {
        BondEvent event = new BondEvent();
        event.setEventType(EventType.REPAYMENT_OF_INTEREST);
        event.setInstallmentNumber(installmentNumber);
        event.setAmount(amount);
        event.setCreatedAt(DateHelper.getLocalDateTimeNow());
        return event;
    }

    protected BondEvent getRepaymentOfPrincipalEvent(Integer installmentNumber, BigDecimal amount) {
        BondEvent event = new BondEvent();
        event.setEventType(EventType.REPAYMENT_OF_PRINCIPAL);
        event.setInstallmentNumber(installmentNumber);
        event.setAmount(amount);
        event.setCreatedAt(DateHelper.getLocalDateTimeNow());
        return event;
    }

    protected BondEvent getRepaymentOfPenaltyEvent(Integer installmentNumber, BigDecimal amount) {
        BondEvent event = new BondEvent();
        event.setEventType(EventType.REPAYMENT_OF_PENALTY);
        event.setInstallmentNumber(installmentNumber);
        event.setAmount(amount);
        event.setCreatedAt(DateHelper.getLocalDateTimeNow());
        return event;
    }
}
