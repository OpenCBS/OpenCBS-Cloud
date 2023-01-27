package com.opencbs.core.domain.enums;

public enum AccountRuleType {
    PRINCIPAL(1),
    INTEREST_ACCRUAL(2),
    INTEREST_INCOME(3),
    WRITE_OFF_PORTFOLIO(4),
    WRITE_OFF_INTEREST(5),
    LOAN_LOSS_RESERVE(9),
    PROVISION_ON_PRINCIPAL(10),
    PROVISION_REVERSAL_ON_PRINCIPAL(11),
    LOAN_LOSS_RESERVE_INTEREST(12),
    PROVISION_ON_INTERESTS(13),
    PROVISION_REVERSAL_ON_INTERESTS(14),
    LOAN_LOSS_RESERVE_PENALTIES(15),
    PROVISION_ON_LATE_FEES(16),
    PROVISION_REVERSAL_ON_LATE_FEES(17),
    EARLY_PARTIAL_REPAYMENT_FEE_INCOME(18),
    EARLY_TOTAL_REPAYMENT_FEE_INCOME(19);

    private int order;

    AccountRuleType(int order) {
        this.order = order;
    }

    public int getOrder() {
        return order;
    }
}
