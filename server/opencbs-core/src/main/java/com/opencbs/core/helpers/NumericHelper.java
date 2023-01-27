package com.opencbs.core.helpers;

import java.math.BigDecimal;

/**
 * Created by Makhsut Islamov on 11.01.2017.
 */
public class NumericHelper {
    @SuppressWarnings("ResultOfMethodCallIgnored")
    public static boolean isValidInt(String value) {
        try {
            Integer.parseInt(value);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static boolean between(BigDecimal amount, BigDecimal min, BigDecimal max) {
        return min.doubleValue() <= amount.doubleValue() && amount.doubleValue() <= max.doubleValue();
    }

    public static boolean isZero(BigDecimal value) {
        return BigDecimal.ZERO.compareTo(value) == 0;
    }

    public static BigDecimal getBigDecimalFromNull(BigDecimal value) {
        return (value==null)?BigDecimal.ZERO:value;
    }
}
