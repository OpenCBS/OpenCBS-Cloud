package com.opencbs.core.helpers;

import junit.framework.TestCase;
import org.junit.Assert;

import java.time.LocalDate;

public class DateHelperTest extends TestCase {

    public void testDaysBetweenAs_30_360() {
        LocalDate start = LocalDate.of(2019,01,28);
        LocalDate end = LocalDate.of(2019,04,01);
        Long daysBetweenAs30360 = DateHelper.daysBetweenAs_30_360(start, end);
        Assert.assertEquals(17L, daysBetweenAs30360.longValue());
    }

    public void testDaysBetweenAs_30_360_2() {
        LocalDate start = LocalDate.of(2019,4,1);
        LocalDate end = LocalDate.of(2019,7,24);
        Long daysBetweenAs30360 = DateHelper.daysBetweenAs_30_360(start, end);
        Assert.assertEquals(37L, daysBetweenAs30360.longValue());
    }
}