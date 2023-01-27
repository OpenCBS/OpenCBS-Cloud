package com.opencbs.core.helpers;

import com.opencbs.core.domain.Holiday;
import org.joda.time.DateTime;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class DateHelper {

    public static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private static DateTimeFormatter formatter;
    public static final String DATE_FORMAT = "yyyy-MM-dd";

    static {
        formatter = DateTimeFormatter.ofPattern(DATE_FORMAT);
    }

    public static boolean isValidDate(String value) {
        try {
            convert(value);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public static Date convert(String value) {
        return localDateToDate(LocalDate.parse(value, formatter));
    }

    public static LocalDate convertStringToLocalDate(String value) {
        return LocalDate.parse(value, formatter);
    }

    public static String convert(LocalDate value) {
        return value.format(formatter);
    }

    public static Boolean isDayOff(LocalDate date) {
        return date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY;
    }

    private static Date localDateToDate(LocalDate localDate) {
        return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    public static LocalDateTime dateToLocalDateTime(Date date) {
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(date.getTime()), ZoneId.systemDefault());
    }

    public static LocalDateTime dateToLocalDateTime(DateTime dateTime) {
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(dateTime.getMillis()), ZoneId.systemDefault());
    }

    public static LocalDate shiftDate(LocalDate date, List<Holiday> holidays) {
        while (DateHelper.isDayOff(date, holidays)) {
            date = date.plusDays(1);
        }
        return date;
    }

    public static LocalDateTime getLocalDateTimeNow() {
        return LocalDateTime.now();
    }

    public static LocalDate getLocalDateNow() {
        return LocalDate.now();
    }

    public static LocalTime getLocalTimeNow() {
        return LocalTime.now();
    }

    private static boolean isDayOff(LocalDate date, List<Holiday> holidays) {
        List<Integer> annualHolidays = holidays
                .stream()
                .filter(Holiday::isAnnual)
                .map(x -> x.getDate().getDayOfYear())
                .collect(Collectors.toList());

        List<LocalDate> dates = holidays
                .stream()
                .filter(x -> !x.isAnnual())
                .map(Holiday::getDate)
                .collect(Collectors.toList());

        if (date.getDayOfWeek() == DayOfWeek.SATURDAY) return true;
        if (date.getDayOfWeek() == DayOfWeek.SUNDAY) return true;
        if (dates.contains(date)) return true;
        return annualHolidays.contains(date.getDayOfYear());
    }

    public static boolean equal(LocalDate date1, LocalDate date2) {
        return date1.isEqual(date2);
    }

    public static boolean lessOrEqual(LocalDate a, LocalDate b) {
        return a.isBefore(b) || a.isEqual(b);
    }

    public static boolean lessOrEqual(LocalDateTime a, LocalDateTime b) {
        return a.isBefore(b) || a.isEqual(b);
    }

    public static boolean greaterOrEqual(LocalDate a, LocalDate b){return  a.isAfter(b) || a.isEqual(b);}

    public static boolean greaterOrEqual(LocalDateTime a, LocalDateTime b){return  a.isAfter(b) || a.isEqual(b);}

    public static boolean greater(LocalDate a, LocalDate b){ return a.isAfter(b);}

    public static boolean greater(LocalDateTime a, LocalDateTime b){ return a.isAfter(b);}

    public static boolean less(LocalDate a, LocalDate b){ return a.isBefore(b);}

    public static boolean less(LocalDateTime a, LocalDateTime b){ return a.isBefore(b);}

    public static LocalDate toLocalDate(org.joda.time.DateTime dateTime) {
        org.joda.time.DateTime dateTimeUtc = dateTime.withZone(org.joda.time.DateTimeZone.UTC);
        return LocalDate.of(dateTimeUtc.getYear(), dateTimeUtc.getMonthOfYear(), dateTimeUtc.getDayOfMonth());
    }

    public static int getDaysCountInYear(int year) {
        return Year.isLeap(year) ? 366 : 365;
    }

    public static boolean equal(LocalDateTime dateTime1, LocalDateTime dateTime2) {
        dateTime1 = setMillisecondToZero(dateTime1);
        dateTime2 = setMillisecondToZero(dateTime2);
        return dateTime1.isEqual(dateTime2);
    }

    private static LocalDateTime setMillisecondToZero(LocalDateTime dateTime) {
        int millis = dateTime.get(ChronoField.MILLI_OF_SECOND);
        return dateTime.minus(millis, ChronoUnit.MILLIS);
    }

    public static Long daysBetween(LocalDate dateBefore, LocalDate dateAfter) {
        return ChronoUnit.DAYS.between(dateBefore, dateAfter);
    }

    public static LocalDate getFirstDayOfQuarter(LocalDate localDate){
        return localDate.with(localDate.getMonth().firstMonthOfQuarter())
                .with(TemporalAdjusters.firstDayOfMonth());
    }

    public static Long daysBetweenAs_30_360(LocalDate dateBegin, LocalDate dateEnd) {
        int days = dateBegin.getDayOfMonth() == 31 ? 30 : dateBegin.getDayOfMonth();
        return (dateEnd.getYear() - dateBegin.getYear()) * 360L
                + (dateEnd.getMonthValue() - dateBegin.getMonthValue()) * 30L + getDayOf30Base(dateEnd) - days;
    }

    private static Integer getDayOf30Base(LocalDate date){
        if (Month.FEBRUARY==date.getMonth() && date.getDayOfMonth()>=28) {
            return 30;
        }

        if (date.getDayOfMonth()>30) {
            return 30;
        }

        return date.getDayOfMonth();
    }

    public static Optional<LocalDateTime> getMaxValue(Optional<LocalDateTime> first, Optional<LocalDateTime> second) {
        if (first.isPresent() && second.isPresent()) {
            return DateHelper.greaterOrEqual(first.get(), second.get())?first:second;
        }

        if (first.isPresent()) {
            return first;
        }

        if (second.isPresent()){
            return second;
        }

        return Optional.empty();
    }
}
