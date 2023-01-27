package com.opencbs.loans.dto.creditcommittee;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.RoleDto;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreditCommitteeAmountRangeDto extends BaseDto {

    private List<RoleDto> roles;

    private BigDecimal minValue;

    private BigDecimal maxValue;

}
