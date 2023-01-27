package com.opencbs.termdeposite.domain.enums;

public enum TermDepositAccountType {
    PRINCIPAL(1),
    INTEREST_ACCRUAL(2),
    INTEREST_EXPENSE(3),
    INTEREST_WRITE_OFF(4),
    EARLY_CLOSE_FEE_ACCOUNT(5);

    private int order;

    TermDepositAccountType(int order) {
        this.order = order;
    }

    public int getOrder() {
        return order;
    }
}