package com.opencbs.core.services.schedulegenerators;

import com.opencbs.core.domain.Holiday;
import com.opencbs.core.domain.enums.ScheduleBasedType;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.dto.ScheduleLookupDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.HolidayService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final HolidayService holidayService;
    private final List<ScheduleGenerator> scheduleGenerators;

    public List<Installment> getSchedule(@NonNull ScheduleParams params) throws ResourceNotFoundException {
        return getScheduleByType(params.getScheduleType()).getSchedule(params);
    }

    public List<String> getScheduleTypes() {
        return scheduleGenerators
                .stream()
                .map(ScheduleGenerator::getType)
                .map(Object::toString)
                .collect(Collectors.toList());
    }

    public List<ScheduleLookupDto> getScheduleTypesLookup(String search) {
        return scheduleGenerators
                .stream()
                .filter(x -> StringUtils.isEmpty(search) || x.getType().toString().toLowerCase().contains(search.toLowerCase()))
                .map(this::toLookupDto)
                .collect(Collectors.toList());
    }

    public LocalDate getPreferredRepaymentDate(@NonNull ScheduleGeneratorTypes scheduleType) throws ResourceNotFoundException {
        LocalDate maturityDate;
        int daysInPeriod = this.getScheduleByType(scheduleType).getDaysInPeriod();
        List<Holiday> holidays = this.holidayService.findAll();

        if (daysInPeriod % 30 == 0) {
            maturityDate = DateHelper.getLocalDateNow().plusMonths(daysInPeriod / 30);
            return DateHelper.shiftDate(maturityDate, holidays);
        }

        maturityDate = DateHelper.getLocalDateNow().plusDays(daysInPeriod);
        return DateHelper.shiftDate(maturityDate, holidays);
    }

    public LocalDate getPreferredRepaymentDateByDisbursementDate(@NonNull ScheduleGeneratorTypes scheduleType, @NonNull LocalDate disbursementDate) throws ResourceNotFoundException {
        LocalDate maturityDate;
        int daysInPeriod = this.getScheduleByType(scheduleType).getDaysInPeriod();
        List<Holiday> holidays = this.holidayService.findAll();

        if (daysInPeriod % 30 == 0) {
            maturityDate = disbursementDate.plusMonths(daysInPeriod / 30);
            return DateHelper.shiftDate(maturityDate, holidays);
        }

        maturityDate = disbursementDate.plusDays(daysInPeriod);
        return DateHelper.shiftDate(maturityDate, holidays);
    }

    public List<ScheduleBasedType> getScheduleBasedTypes() {
        List<ScheduleBasedType> scheduleBasedTypes = Arrays.asList(ScheduleBasedType.values());
        return scheduleBasedTypes.subList(1,scheduleBasedTypes.size());
    }

    public List<ScheduleBasedType> getScheduleBasedTypesLookup(String search) {
        if (StringUtils.isEmpty(search)) {
            return Arrays.asList(ScheduleBasedType.values());
        }

        return Arrays.stream(ScheduleBasedType.values())
                .filter(scheduleBasedType -> scheduleBasedType.toString().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
    }

    public int getScheduleDaysInPeriod(@NonNull ScheduleGeneratorTypes scheduleType) {
        return getScheduleByType(scheduleType).getDaysInPeriod();
    }

    public ScheduleGenerator getScheduleByType(@NonNull ScheduleGeneratorTypes generatorTypes) throws ResourceNotFoundException {
        return scheduleGenerators.stream()
                .filter(x -> x.getType() == generatorTypes)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Schedule %s not found!", generatorTypes)));
    }

    private ScheduleLookupDto toLookupDto(@NonNull ScheduleGenerator scheduleGenerator) {
        return ScheduleLookupDto.builder()
                .id(scheduleGenerator.getType())
                .name(scheduleGenerator.getType().toString())
                .build();
    }
}
