package com.opencbs.bonds.domain.enums;

public enum  BondAccountRuleType {
    PRINCIPAL(1),
    INTEREST_ACCRUAL(2),
    INTEREST_EXPENSE(3),
    INCOME_COMMISSION(4),
    PENALTY(5);

    private int order;

    BondAccountRuleType(int order){
        this.order = order;
    }

    public int getOrder() {
        return order;
    }
}
