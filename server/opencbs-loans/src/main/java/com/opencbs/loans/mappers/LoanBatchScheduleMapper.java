package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.schedule.BatchRepay;
import com.opencbs.core.dto.ScheduleDto;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Mapper
public class LoanBatchScheduleMapper {

    public ScheduleDto mapToScheduleDto(List<BatchRepay> schedule) {
        ScheduleDto scheduleDto = new ScheduleDto();
        scheduleDto.setColumns(Arrays.asList(
                "Name",
                "Principal",
                "Interest",
                "Accrued Interest",
                "Penalty",
                "Principal Payment",
                "Interest Payment",
                "Penalty Payment",
                "Total",
                "Planned OLB"
                )
        );

        scheduleDto.setTypes(Arrays.asList(
                "STRING",
                "DECIMAL",
                "DECIMAL",
                "DECIMAL",
                "DECIMAL",
                "DECIMAL",
                "DECIMAL",
                "DECIMAL",
                "DECIMAL",
                "DECIMAL"
        ));

        scheduleDto.setRows(schedule.stream().map(x -> {
            Map<String, Object> row = new HashMap<>();
            List<Object> data = Arrays.asList(
                    x.getName(),
                    x.getPrincipal(),
                    x.getInterest(),
                    x.getAccruedInterest(),
                    x.getPenalty(),
                    x.getPaidPrincipal(),
                    x.getPaidInterest(),
                    x.getPaidPenalty(),
                    x.getTotal(),
                    x.getOlb()
            );
            row.put("data", data);
            return row;
        }).collect(Collectors.toList()));

        scheduleDto.setTotals(Arrays.asList(
                null,
                this.sum(schedule, BatchRepay::getPrincipal),
                this.sum(schedule, BatchRepay::getInterest),
                this.sum(schedule, BatchRepay::getAccruedInterest),
                this.sum(schedule, BatchRepay::getPenalty),
                this.sum(schedule, BatchRepay::getPaidPrincipal),
                this.sum(schedule, BatchRepay::getPaidInterest),
                this.sum(schedule, BatchRepay::getPaidPenalty),
                this.sum(schedule, BatchRepay::getTotal),
                null
                )
        );

        return scheduleDto;
    }

    private BigDecimal sum(List<BatchRepay> schedule, Function<BatchRepay, BigDecimal> mapper) {
        return schedule.stream()
                .map(mapper)
                .reduce(BigDecimal::add)
                .orElse(BigDecimal.ZERO);
    }
}
