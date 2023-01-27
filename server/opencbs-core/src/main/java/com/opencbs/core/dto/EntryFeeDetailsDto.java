package com.opencbs.core.dto;

import com.opencbs.core.accounting.dto.AccountDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class EntryFeeDetailsDto extends EntryFeeDto {

    private AccountDto account;
}