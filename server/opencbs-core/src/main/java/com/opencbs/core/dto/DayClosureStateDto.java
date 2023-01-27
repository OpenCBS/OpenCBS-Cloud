package com.opencbs.core.dto;

import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.enums.ProcessStatus;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class DayClosureStateDto {

    private int leftDays;

    private Map<ModuleType, ProcessDto> processes;

    private ProcessStatus status;
}