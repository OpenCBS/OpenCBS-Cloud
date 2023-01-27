package com.opencbs.core.helpers;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class TimeZoneHelper {

    public static LocalDateTime fromTimeZoneToUtc(LocalDateTime timestamp, ZoneId zoneId) {
        ZonedDateTime zdt = timestamp.atZone(zoneId);
        ZoneId utcZone = ZoneId.of("UTC");
        ZonedDateTime zdtUtc = zdt.withZoneSameInstant(utcZone);
        return zdtUtc.toLocalDateTime();
    }

    public static LocalDateTime fromTimeZoneToUtc(LocalDateTime timestamp, String zoneName) {
        return TimeZoneHelper.fromTimeZoneToUtc(timestamp, ZoneId.of(zoneName));
    }

    public static LocalDateTime fromUtcToTimeZone(LocalDateTime timestamp, ZoneId zoneId) {
        ZonedDateTime zdt = timestamp.atZone(ZoneId.of("UTC"));
        ZonedDateTime zdtCustom = zdt.withZoneSameInstant(zoneId);
        return zdtCustom.toLocalDateTime();
    }

    public static LocalDateTime fromUtcToTimeZone(LocalDateTime timestamp, String zoneName) {
        return TimeZoneHelper.fromUtcToTimeZone(timestamp, ZoneId.of(zoneName));
    }
}
