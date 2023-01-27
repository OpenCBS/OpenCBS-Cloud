package com.opencbs.core.services;

import com.opencbs.core.domain.Holiday;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.repositories.HolidayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

@Service
public class HolidayService {

    private final HolidayRepository holidayRepository;

    @Autowired
    public HolidayService(HolidayRepository holidayRepository) {
        this.holidayRepository = holidayRepository;
    }

    public List<Holiday> findAll() {
        return this.holidayRepository.findAll(new Sort(Sort.Direction.ASC, "id"));
    }

    public Optional<Holiday> findOne(long id) {
        return Optional.ofNullable(this.holidayRepository.findOne(id));
    }

    public Holiday create(Holiday holiday) {
        holiday.setId(null);
        return this.holidayRepository.save(holiday);
    }

    public Holiday update(Holiday holiday) {
        return this.holidayRepository.save(holiday);
    }

    public Boolean isHoliday(LocalDate date) {
        return this.findAll().stream()
                .anyMatch(x -> x.getDate().equals(date));
    }

    public LocalDate getLastWorkDay(LocalDate date) {
        if (this.isHoliday(date)) {
            while (this.isHoliday(date)) { //returns last not holiday or day off date(working day)
                if (DateHelper.isDayOff(date)) {
                    date = date.with(TemporalAdjusters.previous(DayOfWeek.FRIDAY));
                    continue;
                }
                date = date.minusDays(1);
            }
            this.getLastWorkDay(date); }
        if (DateHelper.isDayOff(date)) {
            date = date.with(TemporalAdjusters.previous(DayOfWeek.FRIDAY));
            this.getLastWorkDay(date); //returns last friday
        }
        return date;
    }
}
