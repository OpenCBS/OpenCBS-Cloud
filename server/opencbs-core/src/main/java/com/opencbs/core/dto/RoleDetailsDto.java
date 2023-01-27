package com.opencbs.core.dto;

import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import lombok.Data;

import java.util.Set;

@Data
public class RoleDetailsDto implements BaseRequestDto {
    private Long id;
    private String name;
    Set<PermissionDto> permissions;
    private boolean isReadOnly;
    private StatusType statusType = StatusType.ACTIVE;
    private Boolean isSystem = Boolean.FALSE;
}
