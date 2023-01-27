package com.opencbs.loans.dto.creditcommittee;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreditCommitteeAmountRangeUpdateDto extends BaseDto {

    private List<Long> roleIds;
    private BigDecimal amount;
}
