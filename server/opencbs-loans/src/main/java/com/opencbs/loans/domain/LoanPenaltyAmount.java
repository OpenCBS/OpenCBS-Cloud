package com.opencbs.loans.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanPenaltyAmount {

    private BigDecimal amount;
    private LoanPenaltyAccount penaltyAccount;
}
