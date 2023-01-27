package com.opencbs.savings.domain.enums;

public enum SavingAccountRuleType {
    SAVING(1),
    INTEREST(2),
    INTEREST_EXPENSE(3),
    DEPOSIT_FEE(4),
    DEPOSIT_FEE_INCOME(5),
    WITHDRAWAL_FEE(6),
    WITHDRAWAL_FEE_INCOME(7),
    MANAGEMENT_FEE(8),
    MANAGEMENT_FEE_INCOME(9),
    ENTRY_FEE(10),
    ENTRY_FEE_INCOME(11),
    CLOSE_FEE(12),
    CLOSE_FEE_INCOME(13);

    private int order;

    SavingAccountRuleType(int order) {
        this.order = order;
    }

    public int getOrder() {
        return order;
    }
}