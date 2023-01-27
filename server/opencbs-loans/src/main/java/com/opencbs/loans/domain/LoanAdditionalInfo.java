package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Transient;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class LoanAdditionalInfo extends BaseEntity {

    public LoanAdditionalInfo(BigDecimal settlementBalance, BigDecimal olb, BigDecimal lateAmount, BigDecimal unAllocatedAmount) {
        this.settlementBalance = settlementBalance;
        this.olb = olb;
        this.lateAmount = lateAmount;
        this.unAllocatedAmount = unAllocatedAmount;
    }

    private BigDecimal settlementBalance;
    private BigDecimal olb;
    private BigDecimal lateAmount;
    private BigDecimal unAllocatedAmount;

    @Transient
    private BigDecimal penalty;

    @Transient
    private LocalDate lastActualizeDate;
}
