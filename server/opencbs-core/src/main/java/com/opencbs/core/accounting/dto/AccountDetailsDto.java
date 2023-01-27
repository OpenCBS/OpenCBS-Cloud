package com.opencbs.core.accounting.dto;

import lombok.Data;

@Data
public class AccountDetailsDto extends AccountDto {
    private boolean hasChildren;
}
