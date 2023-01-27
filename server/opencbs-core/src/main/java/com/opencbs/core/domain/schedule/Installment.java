package com.opencbs.core.domain.schedule;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Installment {

    private long number;
    private LocalDate maturityDate;
    private LocalDate lastAccrualDate;
    private BigDecimal principal;
    private BigDecimal interest;
    private BigDecimal olb;
    private BigDecimal paidPrincipal = BigDecimal.ZERO;
    private BigDecimal paidInterest = BigDecimal.ZERO;

    public BigDecimal getTotalDue() {
        return principal.add(interest).subtract(paidPrincipal.add(paidInterest));
    }
}
