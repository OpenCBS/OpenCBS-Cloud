package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Holiday;
import com.opencbs.core.dto.HolidayDto;
import org.modelmapper.ModelMapper;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static com.opencbs.core.helpers.DateHelper.DATE_FORMAT;

@Mapper
public class HolidayMapper {

    private final ModelMapper modelMapper = new ModelMapper();

    public Holiday mapToEntity(HolidayDto dto) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_FORMAT);
        Holiday holiday = modelMapper.map(dto, Holiday.class);
        holiday.setDate(LocalDate.parse(dto.getDate(), formatter));
        return holiday;
    }

    public HolidayDto mapToDto(Holiday holiday) {
        return modelMapper.map(holiday, HolidayDto.class);
    }
}
