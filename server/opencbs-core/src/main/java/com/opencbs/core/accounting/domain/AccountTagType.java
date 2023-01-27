package com.opencbs.core.accounting.domain;

public enum AccountTagType {
    ASSET(1L),
    LIABILITIES(2L),
    EQUITY(3L),
    REVENUES(5L),
    EXPENSES(6L),
    OFF_BALANCE(7L),
    TELLER(8L),
    CURRENT_ACCOUNT(9L),
    GAIN_ACCOUNT(10L),
    LOSS_ACCOUNT(11L),
    BANK_ACCOUNT(12L);

    private Long Id;

    AccountTagType(Long id) {
        this.Id = id;
    }

    public Long getId() {
        return Id;
    }
}