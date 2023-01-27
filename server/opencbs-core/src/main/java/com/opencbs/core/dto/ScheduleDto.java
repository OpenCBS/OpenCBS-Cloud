package com.opencbs.core.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@EqualsAndHashCode
public class ScheduleDto {

    private List<String> columns = new ArrayList<>();
    private List<String> types = new ArrayList<>();
    private List<Map<String, Object>> rows = new ArrayList<>();
    private List<Object> totals = new ArrayList<>();
}
