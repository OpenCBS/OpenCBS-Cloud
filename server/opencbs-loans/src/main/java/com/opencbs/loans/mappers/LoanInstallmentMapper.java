package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.LoanScheduleInstallment;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.mappers.ScheduleMapper;
import com.opencbs.loans.dto.UpdateScheduleDto;
import com.opencbs.loans.dto.UpdateScheduleStatus;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Mapper
@RequiredArgsConstructor
public class LoanInstallmentMapper {

    private final ScheduleMapper scheduleMapper;


    public UpdateScheduleDto toDto(@NonNull List<Installment> installments, @NonNull BigDecimal totalAmount, UpdateScheduleStatus status) {

        ScheduleDto scheduleDto = scheduleMapper.mapInstallmentsToScheduleDto(installments);

        UpdateScheduleDto updateScheduleDto = UpdateScheduleDto.of(scheduleDto);
        updateScheduleDto.setTotalAmount(totalAmount);
        updateScheduleDto.setStatus(status);

        updateScheduleDto.setTotalPrincipal(installments.stream()
                .map(i->i.getPrincipal())
                .reduce(BigDecimal.ZERO, BigDecimal::add)
        );

        return updateScheduleDto;
    }

    public UpdateScheduleDto loanSchedulerInstallmentToDto(@NonNull List<LoanScheduleInstallment> installments, @NonNull BigDecimal totalAmount, UpdateScheduleStatus status) {

        ScheduleDto scheduleDto = scheduleMapper.mapLoanSchedulleInstallmentsToScheduleDto(installments);

        UpdateScheduleDto updateScheduleDto = UpdateScheduleDto.of(scheduleDto);
        updateScheduleDto.setTotalAmount(totalAmount);
        updateScheduleDto.setStatus(status);

        updateScheduleDto.setTotalPrincipal(installments.stream()
                .map(i->i.getPrincipal())
                .reduce(BigDecimal.ZERO, BigDecimal::add)
        );

        return updateScheduleDto;
    }
}
