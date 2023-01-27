package com.opencbs.loans.dto.loanapplications;

import com.opencbs.core.dto.EntryFeeDetailsDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LoanApplicationEntryFeeUpdateDto {

    private EntryFeeDetailsDto entryFee;

    private BigDecimal amount;

    private BigDecimal rate;
}
