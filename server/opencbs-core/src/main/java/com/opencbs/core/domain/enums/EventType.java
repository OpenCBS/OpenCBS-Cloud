package com.opencbs.core.domain.enums;

import lombok.Getter;

public enum EventType {
    DISBURSEMENT(EventTypeGroup.DISBURSEMENT),
    REPAYMENT_OF_PENALTY(EventTypeGroup.REPAYMENT),
    REPAYMENT_OF_INTEREST(EventTypeGroup.REPAYMENT),
    REPAYMENT_OF_PRINCIPAL(EventTypeGroup.REPAYMENT),
    ACCRUAL_OF_INTEREST(null),
    ACCRUAL_OF_PENALTY(null),
    CLOSED(null),
    RESCHEDULING(null),
    OTHER_FEE_CHARGE(null),
    OTHER_FEE_REPAY(null),
    OTHER_FEE_WAIVE_OFF(null),
    ENTRY_FEE_DISBURSEMENT(EventTypeGroup.DISBURSEMENT),
    CREDIT_LINE_ENTRY_FEE(EventTypeGroup.DISBURSEMENT),
    STRUCTURING_FEE(EventTypeGroup.DISBURSEMENT),
    WRITE_OFF_PENALTY(EventTypeGroup.WRITE_OFF),
    WRITE_OFF_INTEREST(EventTypeGroup.WRITE_OFF),
    WRITE_OFF_OLB(EventTypeGroup.WRITE_OFF),
    TOP_UP(EventTypeGroup.TOP_UP),
    TOP_UP_ENTRY_FEE(EventTypeGroup.TOP_UP),

    VIRTUAL_DISBURSEMENT(EventTypeGroup.DISBURSEMENT),
    VIRTUAL_REPAYMENT(EventTypeGroup.REPAYMENT),
    VIRTUAL_WRITE_OFF(EventTypeGroup.WRITE_OFF),

    SELL(EventTypeGroup.SELL),
    BOND_VALUE_DATE(EventTypeGroup.BOND_VALUE_DATE),

    GAIN_LOSS(EventTypeGroup.GAIN_LOSS),

    REFUND(EventTypeGroup.REFUND),

    ROLLBACK(EventTypeGroup.ROLLBACK);

    @Getter
    private EventTypeGroup eventTypeGroup;

    EventType(EventTypeGroup group) {
        this.eventTypeGroup = group;
    }
}
