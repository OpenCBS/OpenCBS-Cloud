package com.opencbs.core.dto;

import lombok.Data;

import java.util.List;

@Data
public class PermissionDto {
    private String group;
    private List<String> permissions;
}
