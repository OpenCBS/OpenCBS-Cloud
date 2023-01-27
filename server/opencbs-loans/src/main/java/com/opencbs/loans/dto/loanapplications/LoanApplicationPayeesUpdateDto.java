package com.opencbs.loans.dto.loanapplications;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.UserDto;
import com.opencbs.loans.domain.enums.LoanApplicationPayeeStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class LoanApplicationPayeesUpdateDto extends BaseDto {

    private Long loanApplicationId;

    private Long payeeId;

    private String payeeName;

    private String payeeDescription;

    private BigDecimal amount;

    private LocalDate plannedDisbursementDate;

    private String description;

    private LocalDate disbursementDate;

    private LoanApplicationPayeeStatus status;

    private LocalDateTime closedAt;

    private UserDto closedBy;

    private Boolean isDeleted;
}
