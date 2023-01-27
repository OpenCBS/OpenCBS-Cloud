package com.opencbs.core.accounting.dto;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class SortedAccountingEntryDto extends BaseDto {

    private Long accountId;

    private @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate;

    private @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate;

    private Boolean showSystem = Boolean.TRUE;
}
