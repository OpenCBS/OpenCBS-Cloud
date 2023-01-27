package com.opencbs.loans.dto.loanapplications;

import com.opencbs.core.domain.enums.ScheduleBasedType;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.FieldValueDto;
import com.opencbs.core.dto.group.GroupMemberAmountsDto;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class LoanApplicationBaseDto extends BaseDto {

    private Long profileId;
    private Long loanProductId;
    private List<GroupMemberAmountsDto> amounts;
    private LocalDate disbursementDate;
    private LocalDate preferredRepaymentDate;
    private LocalDate maturityDate;
    private Integer maturity;
    private Integer gracePeriod;
    private Long currencyId;
    private ScheduleGeneratorTypes scheduleType;
    private BigDecimal interestRate;
    private List<LoanApplicationPayeesDto> payees;
    private List<LoanApplicationEntryFeeDto> entryFees;
    private List<FieldValueDto> fieldValues;
    private Long userId;
    private ScheduleBasedType scheduleBasedType;
    private Long creditLineId;
}
