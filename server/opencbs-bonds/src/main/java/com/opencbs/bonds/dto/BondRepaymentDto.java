package com.opencbs.bonds.dto;

import com.opencbs.core.domain.RepaymentTypes;
import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BondRepaymentDto extends BaseDto {

    private LocalDateTime timestamp;

    private LocalDate datetime;

    private RepaymentTypes repaymentTypes;

    private BigDecimal total;
}
