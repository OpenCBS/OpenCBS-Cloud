package com.opencbs.core.domain.schedule;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanScheduleInstallment extends Installment{

    private BigDecimal accruedInterest;

    private BigDecimal paidInterest;

    private BigDecimal paidPrincipal;
}
