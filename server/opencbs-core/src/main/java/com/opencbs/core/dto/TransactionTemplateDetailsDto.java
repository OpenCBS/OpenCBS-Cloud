package com.opencbs.core.dto;

import com.opencbs.core.accounting.dto.AccountDto;
import lombok.Data;

import java.util.List;

@Data
public class TransactionTemplateDetailsDto extends BaseDto {

    private String name;
    private List<AccountDto> debitAccounts;
    private List<AccountDto> creditAccounts;
}
