package com.opencbs.loans.services.earlyfee.impl;

import com.opencbs.loans.domain.enums.EarlyRepaymentFeeType;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class EarlyFeePrincipalCalculationService extends EarlyFeeBaseCalculationService {

    @Override
    public BigDecimal getEarlyFeeAmount(@NonNull Long loanId,
                                        @NonNull LocalDateTime timestamp,
                                        @NonNull BigDecimal totalAmount,
                                        @NonNull BigDecimal olb,
                                        @NonNull BigDecimal percent) {
        return getFeeAmount(olb, percent);
    }

    @Override
    public EarlyRepaymentFeeType getType() {
        return EarlyRepaymentFeeType.PRINCIPAL;
    }
}
