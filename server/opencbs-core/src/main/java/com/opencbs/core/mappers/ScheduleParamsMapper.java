package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.dto.ScheduleParamsDto;
import org.modelmapper.ModelMapper;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static com.opencbs.core.helpers.DateHelper.DATE_FORMAT;

@Mapper
public class ScheduleParamsMapper {
    private final ModelMapper modelMapper = new ModelMapper();

    public ScheduleParams mapToEntity(ScheduleParamsDto paramsDto) {
        ScheduleParams params = this.modelMapper.map(paramsDto, ScheduleParams.class);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_FORMAT);
        params.setDisbursementDate(LocalDate.parse(paramsDto.getDisbursementDate(), formatter));
        params.setPreferredRepaymentDate(LocalDate.parse(paramsDto.getPreferredRepaymentDate(), formatter));
        return params;
    }
}
