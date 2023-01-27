package com.opencbs.core.dto.audit;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class HistoryDto {

    private Long number;

    private LocalDate date;

    private String username;

    private List<ChangedDto> changed;
}
