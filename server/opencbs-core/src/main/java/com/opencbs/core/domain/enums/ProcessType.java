package com.opencbs.core.domain.enums;

import java.time.LocalTime;

public enum ProcessType {
    ACCOUNTING_BALANCES(ModuleType.ACCOUNTING, 50000, LocalTime.of(0,11,0)),

    LOAN_INTEREST_ACCRUAL(ModuleType.LOANS, 1, LocalTime.of(0,11,0)),
    LOAN_PROVISION(ModuleType.LOANS, 6, LocalTime.of(0,11,0)),
    LOAN_REMINDER_PROCESS(ModuleType.LOANS, 7, LocalTime.of(0,11,0)),
    LOAN_PENALTY_ACCRUAL(ModuleType.LOANS, 2, LocalTime.of(23,59,59)),
//    GAIN_LOSS_LOAN(ModuleType.LOANS, 3, LocalTime.MAX),
    LOAN_ANALYTIC(ModuleType.LOANS, 4, LocalTime.of(0,11,0)),
    LOAN_AUTO_REPAYMENT(ModuleType.LOANS, 5, LocalTime.of(0,11,0)),

    BORROWING_ACCRUAL(ModuleType.BORROWINGS, 7, LocalTime.of(0,11,0)),
    GAIN_LOSS_BORROWING(ModuleType.BORROWINGS, 8, LocalTime.MAX),

    SAVING_INTEREST_ACCRUAL(ModuleType.SAVINGS, 9, LocalTime.of(0,11,0)),
    SAVING_MANAGEMENT_FEE(ModuleType.SAVINGS, 10, LocalTime.of(0,11,0)),
    SAVING_POSTING(ModuleType.SAVINGS, 11, LocalTime.of(0,11,0)),

    TERM_DEPOSIT_INTEREST_ACCRUAL(ModuleType.TERM_DEPOSITS, 12, LocalTime.of(0,7,0)),
    TERM_DEPOSIT_CLOSING(ModuleType.TERM_DEPOSITS, 13, LocalTime.of(0,7,0)),

    BOND_INTEREST_ACCRUAL(ModuleType.BONDS, 14, LocalTime.of(0,11,0));

    private ModuleType moduleType;
    private int order;
    private LocalTime operationTime;

    ProcessType(ModuleType moduleType, int order, LocalTime operationTime) {
        this.moduleType = moduleType;
        this.order = order;
        this.operationTime = operationTime;
    }

    public ModuleType getModuleType() {
        return moduleType;
    }

    public int getOrder() {
        return order;
    }

    public LocalTime getOperationTime(){ return operationTime; }
}
