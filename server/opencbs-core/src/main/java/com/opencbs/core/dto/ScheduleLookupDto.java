package com.opencbs.core.dto;

import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleLookupDto {
    private ScheduleGeneratorTypes id;
    private String name;
}
