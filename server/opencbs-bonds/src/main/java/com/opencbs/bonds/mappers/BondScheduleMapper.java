package com.opencbs.bonds.mappers;

import com.opencbs.bonds.domain.BondInstallment;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.types.InstallmentStatus;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.helpers.DateHelper;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Mapper
public class BondScheduleMapper {
    public ScheduleDto mapToScheduleDto(List<BondInstallment> schedule) {
        ScheduleDto scheduleDto = new ScheduleDto();
        scheduleDto.setColumns(Arrays.asList(
                "#",
                "Payment Date",
                "Principal",
                "Interest",
                "Accrued Interest",
                "Paid Principal",
                "Paid Interest",
                "Total",
                "Planned OLB"
                )
        );

        scheduleDto.setTypes(Arrays.asList(
                "INTEGER",
                "DATE",
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

            InstallmentStatus status;
            if (x.isPaid()) {
                status = InstallmentStatus.PAID;
            } else if (x.isPartiallyPaid()) {
                status = InstallmentStatus.PARTIALLY_PAID;
            } else {
                status = InstallmentStatus.UNPAID;
            }
            row.put("status", status);

            String overdue;

            if (x.isOverdue(DateHelper.getLocalDateNow())) {
                overdue = "OVERDUE";
            } else {
                overdue = "NOT_OVERDUE";
            }

            row.put("overdue", overdue);

            List<Object> data = Arrays.asList(
                    x.getNumber(),
                    x.getMaturityDate().toString(),
                    x.getPrincipal(),
                    x.getInterest(),
                    x.getAccruedInterest(),
                    x.getPaidPrincipal(),
                    x.getPaidInterest(),
                    x.getTotalDue(),
                    x.getOlb()
            );
            row.put("data", data);
            return row;
        }).collect(Collectors.toList()));

        scheduleDto.setTotals(Arrays.asList(
                null,
                null,
                this.sum(schedule, BondInstallment::getPrincipal),
                this.sum(schedule, BondInstallment::getInterest),
                this.sum(schedule, BondInstallment::getAccruedInterest),
                this.sum(schedule, BondInstallment::getPaidPrincipal),
                this.sum(schedule, BondInstallment::getPaidInterest),
                this.sum(schedule, BondInstallment::getTotalDue),
                null
                )
        );

        return scheduleDto;
    }

    private BigDecimal sum(List<BondInstallment> schedule, Function<BondInstallment, BigDecimal> mapper) {
        return schedule.stream()
                .map(mapper)
                .reduce(BigDecimal::add)
                .orElse(BigDecimal.ZERO);
    }
}
