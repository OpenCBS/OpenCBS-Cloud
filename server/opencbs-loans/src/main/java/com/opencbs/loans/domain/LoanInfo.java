package com.opencbs.loans.domain;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
@Data
public class LoanInfo {
    private BigDecimal principal;
    private BigDecimal paidPrincipal;
    private Long lateDaysOfPrincipal;
    private BigDecimal interest;
    private BigDecimal paidInterest;
    private Long lateDaysOfInterest;
    private BigDecimal penalty;
    private Long lateDaysOfPenalty;
    private BigDecimal plannedOlb;
    private LocalDate nextPlanedPaymentDate;

    public BigDecimal getOlb() {
        return principal.subtract(paidPrincipal);
    }

    public BigDecimal getInterest() {
        return interest.subtract(paidInterest);
    }
}
