package com.opencbs.loans.dto;

import com.opencbs.loans.dto.loanapplications.LoanApplicationEntryFeeDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class LoanTopUpDto {
    private BigDecimal amount;
    private BigDecimal interestRate;
    private Integer gracePeriod;
    private LocalDate disbursementDate;
    private LocalDate preferredRepaymentDate;
    private List<LoanApplicationEntryFeeDto> entryFees;
    private Integer maturity;
}
