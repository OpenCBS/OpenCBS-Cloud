package com.opencbs.loans.dto;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.UserBaseDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimplifiedLoanDto extends BaseDto {

        private String profileName;
        private BigDecimal amount;
        private String code;
        private BigDecimal interestRate;
        private Long applicationId;
        private String applicationCode;
        private String type;
        private String productName;
        private String createdBy;
        private String status;
        private LocalDateTime createdAt;
        private String branchName;
        private String currency;
        private LocalDate disbursementDate;
        private LocalDate maturityDate;
        private UserBaseDto loanOfficer;
        private String creditLine;
        private BigDecimal creditLineOutstandingAmount;

}
