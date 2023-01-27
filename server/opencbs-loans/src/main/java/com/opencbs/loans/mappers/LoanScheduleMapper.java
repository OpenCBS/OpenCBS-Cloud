package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.types.InstallmentStatus;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.mappers.ScheduleMapper;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.domain.schedules.installments.LoanApplicationInstallment;
import com.opencbs.loans.services.impl.InstallmentNumberComparator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Mapper
public class LoanScheduleMapper extends ScheduleMapper {

    public ScheduleDto mapToScheduleDto(List<LoanInstallment> schedule, LocalDate localDate) {
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

            if (x.isOverdue(localDate)) {
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
                this.sum(schedule, LoanInstallment::getPrincipal),
                this.sum(schedule, LoanInstallment::getInterest),
                this.sum(schedule, LoanInstallment::getAccruedInterest),
                this.sum(schedule, LoanInstallment::getPaidPrincipal),
                this.sum(schedule, LoanInstallment::getPaidInterest),
                this.sum(schedule, LoanInstallment::getTotalDue),
                null
                )
        );

        return scheduleDto;
    }

    public ScheduleDto mapLoanApplicationInstallmentsToScheduleDto(List<LoanApplicationInstallment> schedule) {
        return this.mapInstallmentsToScheduleDto(
                schedule
                        .stream()
                        .map(x -> this.modelMapper.map(x, Installment.class))
                        .sorted(new InstallmentNumberComparator())
                        .collect(Collectors.toList())
        );
    }

    private BigDecimal sum(List<LoanInstallment> schedule, Function<LoanInstallment, BigDecimal> mapper) {
        return schedule.stream()
                .map(mapper)
                .reduce(BigDecimal::add)
                .orElse(BigDecimal.ZERO);
    }
}
