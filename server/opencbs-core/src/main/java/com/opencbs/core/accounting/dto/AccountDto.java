package com.opencbs.core.accounting.dto;

import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.BranchDto;
import com.opencbs.core.dto.CurrencyDto;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import lombok.Data;

@Data
public class AccountDto extends BaseDto implements BaseRequestDto {

    private String number;
    private String name;
    private CurrencyDto currency;
    private BranchDto branch;
    private Boolean isDebit;
    private AccountType accountType;
    private Boolean hasTransactions = false;
    private String parentAccountNumber = null;
    private Boolean locked;
    private Boolean allowedTransferFrom;
    private Boolean allowedTransferTo;
    private Boolean allowedCashDeposit;
    private Boolean allowedCashWithdrawal;
    private Boolean allowedManualTransaction;
    private Boolean isTemplateDebit;
}
