package com.opencbs.loans.dto.loanapplications;

import com.opencbs.core.domain.User;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.loans.domain.enums.LoanApplicationPayeeStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class LoanApplicationPayeesDto extends BaseDto {

    private Integer payeeId;

    private BigDecimal amount;

    private LocalDate plannedDisbursementDate;

    private String description;

    private LocalDate disbursementDate;

    private LoanApplicationPayeeStatus status;

    private LocalDateTime closedAt;

    private User closedBy;
}
