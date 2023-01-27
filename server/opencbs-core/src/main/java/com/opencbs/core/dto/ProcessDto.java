package com.opencbs.core.dto;

import com.opencbs.core.domain.enums.ProcessStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProcessDto {

    private String title;

    private ProcessStatus status;

    private int progress;

    private int order;
}
