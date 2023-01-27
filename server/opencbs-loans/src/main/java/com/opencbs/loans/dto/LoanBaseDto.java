package com.opencbs.loans.dto;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.dto.UserInfoDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public abstract class LoanBaseDto extends BaseDto {

    private String preferredRepaymentDate;
    private String maturityDate;
    private BigDecimal interestRate;
    private int maturity;
    private int gracePeriod;
    private String scheduleType;
    private String createdAt;
    private ScheduleDto installments;
    private UserInfoDto createdBy;
    private String status;

}
