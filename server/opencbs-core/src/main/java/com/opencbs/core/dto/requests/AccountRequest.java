package com.opencbs.core.dto.requests;

import com.opencbs.core.domain.enums.AccountType;
import lombok.Data;

import java.util.List;

@Data
public class AccountRequest {

    private Long currencyId;
    private String search;
    private List<AccountType> accountTypes;
    private TypeOfAccount typeOfAccount;

    public enum TypeOfAccount {
        DEBIT,
        CREDIT,
    }
}
