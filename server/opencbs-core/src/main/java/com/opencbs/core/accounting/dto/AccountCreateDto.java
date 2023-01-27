package com.opencbs.core.accounting.dto;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

@Data
public class AccountCreateDto extends BaseDto {

    private Long parentAccountId;
    private String childNumber;
    private String parentNumber;
    private String name;
    private Integer currencyId;
    private Long branchId;
    private Boolean isDebit;
    private Boolean locked;
    private Boolean allowedTransferFrom;
    private Boolean allowedTransferTo;
    private Boolean allowedCashDeposit;
    private Boolean allowedCashWithdrawal;
    private Boolean allowedManualTransaction;

}