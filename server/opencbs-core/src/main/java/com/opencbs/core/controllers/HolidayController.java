package com.opencbs.core.controllers;

import com.opencbs.core.domain.Holiday;
import com.opencbs.core.dto.HolidayDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.HolidayMapper;
import com.opencbs.core.services.HolidayService;
import com.opencbs.core.validators.HolidayDtoValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RestController
@RequestMapping(value = "/api/holidays")
public class HolidayController {
    private final HolidayService holidayService;
    private final HolidayDtoValidator holidayDtoValidator;
    private final HolidayMapper holidayMapper;

    @Autowired
    public HolidayController(HolidayService holidayService,
                             HolidayDtoValidator holidayDtoValidator, HolidayMapper holidayMapper) {
        this.holidayService = holidayService;
        this.holidayDtoValidator = holidayDtoValidator;
        this.holidayMapper = holidayMapper;
    }

    @RequestMapping(method = GET)
    public List<HolidayDto> get() {
        return this.holidayService.findAll()
                .stream().map(this.holidayMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/{id}", method = GET)
    public HolidayDto get(@PathVariable long id) throws Exception {
        Holiday holiday = this.holidayService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Holiday not found (ID=%d).", id)));
        return this.holidayMapper.mapToDto(holiday);
    }

    @RequestMapping(method = POST)
    public HolidayDto post(@RequestBody HolidayDto holidayDto) {
        this.holidayDtoValidator.validate(holidayDto);
        Holiday holiday = this.holidayMapper.mapToEntity(holidayDto);
        return this.holidayMapper.mapToDto(this.holidayService.create(holiday));
    }

    @RequestMapping(value = "/{id}", method = PUT)
    public HolidayDto put(@PathVariable long id, @RequestBody HolidayDto holidayDto) throws Exception {
        this.holidayService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Holiday not found (ID=%d).", id)));
        this.holidayDtoValidator.validate(holidayDto);
        Holiday holiday = this.holidayMapper.mapToEntity(holidayDto);
        holiday.setId(id);
        return this.holidayMapper.mapToDto(this.holidayService.update(holiday));
    }
}
