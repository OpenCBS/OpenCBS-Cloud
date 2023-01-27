package com.opencbs.core.dto.audit;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChangedDto {

    private String fieldName;

    private String prefValue;

    private String value;
}
