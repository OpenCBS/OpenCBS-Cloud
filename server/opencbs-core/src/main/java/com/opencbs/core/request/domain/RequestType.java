package com.opencbs.core.request.domain;

import com.opencbs.core.domain.enums.ModuleType;
import lombok.Getter;

@Getter
public enum RequestType {

    ROLE_EDIT(null),
    ROLE_CREATE(null),

    LOAN_PRODUCT_EDIT(null),
    LOAN_PRODUCT_CREATE(null),

    SAVING_PRODUCT_EDIT(null),
    SAVING_PRODUCT_CREATE(null),

    TERM_DEPOSIT_PRODUCT_EDIT(null),
    TERM_DEPOSIT_PRODUCT_CREATE(null),

    USER_EDIT(null),
    USER_CREATE(null),

    ACCOUNT_EDIT(null),
    ACCOUNT_CREATE(null),

    LOAN_DISBURSEMENT(ModuleType.LOAN_APPLICATIONS, true),
    LOAN_REPAYMENT(ModuleType.LOANS, true),
    LOAN_ROLLBACK(ModuleType.LOANS, true),

    PEOPLE_CREATE(null),
    PEOPLE_EDIT(null),

    COMPANY_CREATE(null),
    COMPANY_EDIT(null),

    GROUP_CREATE(null),
    GROUP_EDIT(null);

    private ModuleType Type;

    private Boolean event = false;

    RequestType(ModuleType type) {
        this.Type = type;
    }

    RequestType(ModuleType type, Boolean event) {
        this.Type = type;
        this.event = event;
    }
}
