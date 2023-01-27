package com.opencbs.loans.dto.products;

import com.opencbs.core.domain.enums.ScheduleBasedType;
import com.opencbs.loans.domain.enums.EarlyRepaymentFeeType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
public class LoanProductDto extends LoanProductBaseDto {

    private Long currencyId;
    private Set<Long> fees;
    private Set<Long> penalties;
    private ProductAccountDto accountList;
    private boolean topUpAllow;
    private BigDecimal topUpMaxLimit;
    private BigDecimal topUpMaxOlb;
    private ScheduleBasedType scheduleBasedType;
    private EarlyRepaymentFeeType earlyPartialRepaymentFeeType;
    private BigDecimal earlyPartialRepaymentFeeValue;
    private EarlyRepaymentFeeType earlyTotalRepaymentFeeType;
    private BigDecimal earlyTotalRepaymentFeeValue;
    private LocalDate maturityDateMax;
}

