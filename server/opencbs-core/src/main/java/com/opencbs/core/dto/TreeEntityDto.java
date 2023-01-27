package com.opencbs.core.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class TreeEntityDto {

    private Map<String, Object> data;
    private Map<String, Object> parent;
    private List<TreeEntityDto> children;
    private boolean expanded = false;
}
