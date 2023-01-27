package com.opencbs.loans.dto.impotrpaymenthistory;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class RepaymentHistoryFilterDto {

    private @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate fromDate = LocalDate.MIN;

    private @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate toDate = LocalDate.MAX;
}
