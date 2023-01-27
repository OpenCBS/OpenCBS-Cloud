package com.opencbs.core.dto;

import com.opencbs.core.accounting.dto.AccountDto;
import lombok.Data;

@Data
public class EntryFeeMainDto extends EntryFeeBaseDto {
    private AccountDto account;
    private boolean isPercentage;
}
