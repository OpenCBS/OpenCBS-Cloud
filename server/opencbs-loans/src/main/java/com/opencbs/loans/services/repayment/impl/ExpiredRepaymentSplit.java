package com.opencbs.loans.services.repayment.impl;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ExpiredRepaymentSplit {

    @Builder.Default
    private BigDecimal penalty;

    @Builder.Default
    private BigDecimal interest;

    @Builder.Default
    private BigDecimal principal;


    public  BigDecimal getTotal() {
        return penalty.add(interest).add(principal);
    }
}
