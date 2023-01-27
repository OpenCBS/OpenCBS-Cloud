package com.opencbs.core.dto.group;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GroupMemberAmountsDto {

    private BigDecimal amount;
    private Long memberId;
    private Long loanId;
}
