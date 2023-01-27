package com.opencbs.core.dto;

import lombok.Data;

import java.util.Set;

@Data
public class TransactionTemplateDto extends BaseDto {

    private String name;
    private Set<Long> debitAccounts;
    private Set<Long> creditAccounts;
}
