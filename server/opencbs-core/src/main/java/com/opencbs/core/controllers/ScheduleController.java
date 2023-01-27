package com.opencbs.core.controllers;

import com.opencbs.core.domain.enums.ScheduleBasedType;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.dto.ScheduleBasedTypeDto;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.dto.ScheduleLookupDto;
import com.opencbs.core.dto.ScheduleParamsDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.ScheduleMapper;
import com.opencbs.core.mappers.ScheduleParamsMapper;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import com.opencbs.core.services.schedulegenerators.ScheduleService;
import com.opencbs.core.validators.ScheduleParamsDtoValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api")
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final ScheduleMapper scheduleMapper;
    private final ScheduleParamsDtoValidator scheduleParamsDtoValidator;
    private final ScheduleParamsMapper scheduleParamsMapper;


    @RequestMapping(value = "/schedules", method = POST)
    public ScheduleDto get(@RequestBody ScheduleParamsDto paramsDto) throws Exception {
        this.scheduleParamsDtoValidator.validate(paramsDto);
        ScheduleParams params = this.scheduleParamsMapper.mapToEntity(paramsDto);

        List<Installment> schedule = this.scheduleService.getSchedule(params);

        return this.scheduleMapper.mapInstallmentsToScheduleDto(schedule);
    }

    @GetMapping("/schedule-types")
    public List<String> getScheduleTypes() {
        return scheduleService.getScheduleTypes();
    }

    @RequestMapping(value = "/schedule-types/lookup", method = GET)
    public Page<ScheduleLookupDto> getLookup(@RequestParam(value = "search", required = false) String search) {
        List<ScheduleLookupDto> scheduleTypes = this.scheduleService.getScheduleTypesLookup(search);
        return new PageImpl<>(scheduleTypes);
    }

    @RequestMapping(value = "/schedule-preferred-repayment-dates", method = GET)
    public LocalDate getPreferredRepaymentDate(@RequestParam(value = "scheduleType") ScheduleGeneratorTypes scheduleType) throws ResourceNotFoundException {
        return this.scheduleService.getPreferredRepaymentDate(scheduleType);
    }

    @RequestMapping(value = "/schedule-based-types", method = GET)
    public List<ScheduleBasedType> getScheduleBasedType() {
        return this.scheduleService.getScheduleBasedTypes();
    }

    @RequestMapping(value = "/schedule-based-types/lookup", method = GET)
    public Page<ScheduleBasedTypeDto> getScheduleBasedTypeLookup(@RequestParam(value = "search", required = false) String search) {
        List<ScheduleBasedType> scheduleBasedTypes = this.scheduleService.getScheduleBasedTypesLookup(search);
        return new PageImpl<>(scheduleBasedTypes).map(scheduleBasedType->new ScheduleBasedTypeDto(scheduleBasedType.toString(),scheduleBasedType.toString()));
    }
}
