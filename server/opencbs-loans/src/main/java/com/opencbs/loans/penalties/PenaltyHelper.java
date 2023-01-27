package com.opencbs.loans.penalties;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Service
public class PenaltyHelper {

    /*
    * Percent by year
    * */
    public static  BigDecimal getPercentByValue(BigDecimal percent, BigDecimal value, LocalDate calculateDate){
        BigDecimal koff = BigDecimal.valueOf(calculateDate.lengthOfYear()).multiply(BigDecimal.valueOf(100L));
        return value.multiply(percent).divide(koff,2, RoundingMode.HALF_EVEN);
    }
}
