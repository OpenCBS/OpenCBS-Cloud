package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.LoanScheduleInstallment;
import com.opencbs.core.domain.types.InstallmentStatus;
import com.opencbs.core.dto.ScheduleDto;
import org.modelmapper.ModelMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Mapper
public class ScheduleMapper  {

    public static final String PLANNED_OLB = "Planned OLB";
    public static final String TOTAL = "Total";
    public static final String INTEREST = "Interest";
    public static final String PRINCIPAL = "Principal";
    public static final String PAYMENT_DATE = "Payment Date";
    public static final String HASH_TAG = "#";
    public static final String PAID_PRINCIPAL = "Paid Principal";
    public static final String PAID_INTEREST = "Paid Interest";
    public static final String ACCRUED_INTEREST = "Accrued Interest";


    protected final ModelMapper modelMapper = new ModelMapper();


    public ScheduleDto mapInstallmentsToScheduleDto(List<Installment> schedule) {
        ScheduleDto scheduleDto = new ScheduleDto();
        scheduleDto.setColumns(Arrays.asList(
                HASH_TAG,
                PAYMENT_DATE,
                PRINCIPAL,
                INTEREST,
                TOTAL,
                PLANNED_OLB
                )
        );

        scheduleDto.setTypes(Arrays.asList(
                "INTEGER",
                "DATE",
                "DECIMAL",
                "DECIMAL",
                "DECIMAL",
                "DECIMAL"
        ));

        scheduleDto.setRows(schedule.stream().map(x -> {
            Map<String, Object> row = new HashMap<>();
            row.put("status", InstallmentStatus.UNPAID);

            List<Object> data = Arrays.asList(
                    x.getNumber(),
                    x.getMaturityDate().toString(),
                    x.getPrincipal(),
                    x.getInterest(),
                    x.getTotalDue(),
                    x.getOlb()
            );
            row.put("data", data);
            return row;
        }).collect(Collectors.toList()));

        scheduleDto.setTotals(Arrays.asList(
                null,
                null,
                this.sum(schedule, Installment::getPrincipal),
                this.sum(schedule, Installment::getInterest),
                this.sum(schedule, Installment::getTotalDue),
                null
                )
        );

        return scheduleDto;
    }

    private BigDecimal sum(List<Installment> schedule, Function<Installment, BigDecimal> mapper) {
        return schedule.stream()
                .map(mapper)
                .reduce(BigDecimal::add)
                .orElse(BigDecimal.ZERO);
    }

    private BigDecimal sum2(List<LoanScheduleInstallment> schedule, Function<LoanScheduleInstallment, BigDecimal> mapper) {
        return schedule.stream()
                .map(mapper)
                .reduce(BigDecimal::add)
                .orElse(BigDecimal.ZERO);
    }

    public List<Installment> mapScheduleDtoToInstallments(ScheduleDto schedule) {
        List<Installment> installments = new ArrayList<>();

        Integer interestColumn = schedule.getColumns().indexOf(INTEREST);
        Integer principalColumn = schedule.getColumns().indexOf(PRINCIPAL);
        Integer olbColumn = schedule.getColumns().indexOf(PLANNED_OLB);

        Integer paidPrincipalColumn = schedule.getColumns().indexOf(PAID_PRINCIPAL);
        Integer paidInterestColumn = schedule.getColumns().indexOf(PAID_INTEREST);
        Integer maturityDateColumn = schedule.getColumns().indexOf(PAYMENT_DATE);

        for (Map<String, Object> installment : schedule.getRows()) {
            List<Object> data = (List<Object>) installment.get("data");
            installments.add(
                    Installment.builder()
                            .number(Long.parseLong(data.get(0).toString()))
                            .maturityDate(LocalDate.parse(data.get(maturityDateColumn).toString()))
                            .principal(new BigDecimal(data.get(principalColumn).toString()))
                            .interest(new BigDecimal(data.get(interestColumn).toString()))
                            .olb(new BigDecimal(data.get(olbColumn).toString()))
                            .paidPrincipal((paidPrincipalColumn<0)?BigDecimal.ZERO:new BigDecimal(data.get(paidPrincipalColumn).toString()))
                            .paidInterest((paidPrincipalColumn<0)?BigDecimal.ZERO:new BigDecimal(data.get(paidInterestColumn).toString()))
                            .build()
            );
        }


        return installments;
    }

    public List<LoanScheduleInstallment> mapScheduleDtoToLoanScheduleInstallments(ScheduleDto schedule) {
        List<LoanScheduleInstallment> installments = new ArrayList<>();

        for (Map<String, Object> installment : schedule.getRows()) {
            List<Object> data = (List<Object>) installment.get("data");
            installments.add( buildLoaSchedulerInstallment(data, schedule.getColumns()));
        }

        return installments;
    }

    private LoanScheduleInstallment buildLoaSchedulerInstallment(List<Object> data, List<String> columns ) {
        Integer interestColumn = columns.indexOf(INTEREST);
        Integer principalColumn = columns.indexOf(PRINCIPAL);
        Integer olbColumn = columns.indexOf(PLANNED_OLB);

        Integer paidPrincipalColumn = columns.indexOf(PAID_PRINCIPAL);
        Integer paidInterestColumn = columns.indexOf(PAID_INTEREST);
        Integer accruedInterestColumn = columns.indexOf(ACCRUED_INTEREST);
        Integer maturityDataColumn = columns.indexOf(PAYMENT_DATE);


        LoanScheduleInstallment loanScheduleInstallment = new LoanScheduleInstallment();

        loanScheduleInstallment.setNumber(Long.parseLong(data.get(0).toString()));
        loanScheduleInstallment.setMaturityDate(LocalDate.parse(data.get(maturityDataColumn).toString()));

        loanScheduleInstallment.setPrincipal(new BigDecimal(data.get(principalColumn).toString()));
        loanScheduleInstallment.setInterest(new BigDecimal(data.get(interestColumn).toString()));
        loanScheduleInstallment.setOlb(new BigDecimal(data.get(olbColumn).toString()));
        loanScheduleInstallment.setAccruedInterest(new BigDecimal(data.get(accruedInterestColumn).toString()));
        loanScheduleInstallment.setPaidPrincipal((paidPrincipalColumn<0)?BigDecimal.ZERO:new BigDecimal(data.get(paidPrincipalColumn).toString()));
        loanScheduleInstallment.setPaidInterest((paidInterestColumn<0)?BigDecimal.ZERO:new BigDecimal(data.get(paidInterestColumn).toString()));

        return loanScheduleInstallment;
    }

    public ScheduleDto mapLoanSchedulleInstallmentsToScheduleDto(List<LoanScheduleInstallment> schedule) {
        ScheduleDto scheduleDto = new ScheduleDto();
        scheduleDto.setColumns(Arrays.asList(
                HASH_TAG,
                PAYMENT_DATE,
                PRINCIPAL,
                INTEREST,
                ACCRUED_INTEREST,
                PAID_PRINCIPAL,
                PAID_INTEREST,
                TOTAL,
                PLANNED_OLB
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
            row.put("status", InstallmentStatus.UNPAID);

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
                this.sum2(schedule, LoanScheduleInstallment::getPrincipal),
                this.sum2(schedule, LoanScheduleInstallment::getInterest),
                this.sum2(schedule, LoanScheduleInstallment::getAccruedInterest),
                this.sum2(schedule, LoanScheduleInstallment::getPaidPrincipal),
                this.sum2(schedule, LoanScheduleInstallment::getPaidInterest),
                this.sum2(schedule, LoanScheduleInstallment::getTotalDue),
                null
                )
        );

        return scheduleDto;
    }

}
