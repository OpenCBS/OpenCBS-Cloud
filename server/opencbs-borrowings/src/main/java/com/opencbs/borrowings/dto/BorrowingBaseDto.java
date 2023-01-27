package com.opencbs.borrowings.dto;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BorrowingBaseDto extends BaseDto {
    private BigDecimal amount;
    private BigDecimal interestRate;
    private ScheduleGeneratorTypes scheduleType;
    private Integer maturity;
    private Integer gracePeriod;
    private LocalDate preferredRepaymentDate;
    private String code;
    private LocalDateTime createdAt;
    private LocalDate disbursementDate;
    private String status;
}
