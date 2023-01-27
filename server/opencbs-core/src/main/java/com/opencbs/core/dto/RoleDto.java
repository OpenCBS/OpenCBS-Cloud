package com.opencbs.core.dto;

import lombok.Data;

@Data
public class RoleDto {

    private Long id;

    private String name;

    private Boolean isSystem = Boolean.FALSE;
}
