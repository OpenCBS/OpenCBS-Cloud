package com.opencbs.core.dto;

import lombok.Data;

@Data
public class HolidayDto extends BaseDto {

    private String name;

    private String date;

    private boolean isAnnual;
}
