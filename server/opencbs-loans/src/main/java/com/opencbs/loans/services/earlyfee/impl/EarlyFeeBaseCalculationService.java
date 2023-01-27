package com.opencbs.loans.services.earlyfee.impl;

import com.opencbs.loans.services.earlyfee.EarlyFeeCalculationService;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public abstract class EarlyFeeBaseCalculationService implements EarlyFeeCalculationService {

    protected BigDecimal getFeeAmount(@NonNull BigDecimal amount, @NonNull BigDecimal percent) {
        return amount.multiply(percent)
                .divide(BigDecimal.valueOf(100), ROUND_MODE)
                .setScale(DECIMAL_PLACE, ROUND_MODE);
    }
}
