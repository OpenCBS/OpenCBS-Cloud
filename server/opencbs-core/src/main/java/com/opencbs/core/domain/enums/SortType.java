package com.opencbs.core.domain.enums;

import lombok.Getter;

@Getter
public enum SortType {
    PROFILE("profileName"),
    PROFILE_TYPE("profileType"),
    CONTRACT_CODE("code"),
    AMOUNT("amount"),
    INTEREST_RATE("interestRate"),
    PRODUCT_NAME("loanProductName"),
    CREATED_AT("createdAt"),
    BRANCH_NAME("branch"),
    STATUS("status");

    private String name;

    SortType(String name) {
        this.name = name;
    }
}
