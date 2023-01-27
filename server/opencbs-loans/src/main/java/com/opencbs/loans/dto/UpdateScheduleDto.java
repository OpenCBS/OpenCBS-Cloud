package com.opencbs.loans.dto;

import com.opencbs.core.dto.ScheduleDto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NonNull;

import java.math.BigDecimal;
import java.util.ArrayList;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateScheduleDto extends ScheduleDto {

    private UpdateScheduleStatus status;
    private BigDecimal totalPrincipal;
    private BigDecimal totalAmount;


    public static UpdateScheduleDto of(@NonNull ScheduleDto dto) {
        UpdateScheduleDto updateDto = new UpdateScheduleDto();
        updateDto.setColumns(new ArrayList<>(dto.getColumns()));
        updateDto.setTypes(new ArrayList<>(dto.getTypes()));
        updateDto.setRows(new ArrayList<>(dto.getRows()));
        updateDto.setTotals(new ArrayList<>(dto.getTotals()));

        return updateDto;
    }
}
