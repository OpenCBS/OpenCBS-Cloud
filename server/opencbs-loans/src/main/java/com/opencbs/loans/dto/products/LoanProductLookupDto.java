package com.opencbs.loans.dto.products;

import com.opencbs.core.domain.enums.ScheduleBasedType;
import com.opencbs.core.dto.CurrencyDto;
import com.opencbs.core.dto.EntryFeeDetailsDto;
import com.opencbs.core.dto.penalty.PenaltyInfoDto;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.loans.domain.enums.EarlyRepaymentFeeType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class LoanProductLookupDto extends LoanProductBaseDto implements BaseRequestDto {

    private CurrencyDto currency;
    private List<EntryFeeDetailsDto> fees;
    private List<PenaltyInfoDto> penalties;
    private boolean topUpAllow;
    private BigDecimal topUpMaxLimit;
    private BigDecimal topUpMaxOlb;
    private boolean isReadOnly;
    private ScheduleBasedType scheduleBasedType;
    private EarlyRepaymentFeeType earlyPartialRepaymentFeeType;
    private BigDecimal earlyPartialRepaymentFeeValue;
    private EarlyRepaymentFeeType earlyTotalRepaymentFeeType;
    private BigDecimal earlyTotalRepaymentFeeValue;
    private LocalDate maturityDateMax;
}
