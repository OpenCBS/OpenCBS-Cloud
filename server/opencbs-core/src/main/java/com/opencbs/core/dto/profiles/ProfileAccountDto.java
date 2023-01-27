package com.opencbs.core.dto.profiles;

import com.opencbs.core.accounting.dto.AccountDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProfileAccountDto extends AccountDto {
    private BigDecimal balance;
}
