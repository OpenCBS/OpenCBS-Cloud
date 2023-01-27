package com.opencbs.termdeposite.domain.enums;

public enum TermDepositAction {
    TRANSACTION_BASE_BALANCE_TO_CURRENT_ACCOUNT("Transaction deposit balance to current account"),
    TRANSACTION_ACCRUAL_INTEREST_TO_BANK("Transaction accrual interest to bank balance"),
    TRANSACTION_ACCRUAL_INTEREST_TO_CURRENT_ACCOUNT("Transaction accrual interest to current account"),
    TRANSACTION_AMOUNT_TO_TERM_DEPOSIT_ACCOUNT("Transaction amount from current account to deposit"),
    TRANSACTION_AMOUNT_TO_EARLY_CLOSE_FEE("Transaction amount from current account to early close fee");

    private String message;

    TermDepositAction(String message) {
        this.message = message;
    }

    public String getMessage() {
        return this.message;
    }
}
