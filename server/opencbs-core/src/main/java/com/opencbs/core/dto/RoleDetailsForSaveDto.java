package com.opencbs.core.dto;

import com.opencbs.core.domain.enums.StatusType;
import lombok.Data;

import java.util.Set;

@Data
public class RoleDetailsForSaveDto extends BaseDto {
    private String name;
    Set<String> permissions;
    private StatusType statusType = StatusType.ACTIVE;
}
