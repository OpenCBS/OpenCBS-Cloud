package com.opencbs.core.accounting.dto;

import com.opencbs.core.domain.enums.TillStatus;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.UserInfoDto;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class TillDetailsDto extends BaseDto {

    private String name;
    private String branchName;
    private Long branchId;
    private TillStatus status;
    private String openedAt;
    private String closedAt;
    private UserInfoDto teller;
    private Set<AccountDto> accounts;
    private BigDecimal balance;
}
