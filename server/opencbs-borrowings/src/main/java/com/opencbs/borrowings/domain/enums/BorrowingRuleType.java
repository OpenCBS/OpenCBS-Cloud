package com.opencbs.borrowings.domain.enums;

public enum BorrowingRuleType {
    PRINCIPAL(1),
    INTEREST_ACCRUAL(2),
    INTEREST_EXPENSE(3);

    private int order;

    BorrowingRuleType(int order) {
        this.order = order;
    }

    public int getOrder() {
        return order;
    }
}