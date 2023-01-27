package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Permission;
import com.opencbs.core.dto.PermissionDto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper
public class PermissionMapper {
    public List<PermissionDto> matToDto(List<Permission> allPermissions) {
        return allPermissions
                .stream()
                .map(Permission::getModuleType)
                .distinct()
                .map(x -> {
                    PermissionDto permissionDto = new PermissionDto();
                    permissionDto.setGroup(x.name());
                    List<String> permissions = allPermissions
                            .stream()
                            .filter(c -> c.getModuleType().equals(x))
                            .map(Permission::getName)
                            .collect(Collectors.toList());
                    permissionDto.setPermissions(permissions);
                    return permissionDto;
                }).collect(Collectors.toList());
    }

    public List<PermissionDto> matToDtoForRole(List<Permission> allPermissions) {
        List<PermissionDto> result = new ArrayList<>();
        PermissionDto permissionDto = new PermissionDto();
        List<String> permissions = allPermissions
                .stream()
                .map(Permission::getName)
                .collect(Collectors.toList());
        permissionDto.setPermissions(permissions);
        result.add(permissionDto);
        return result;
    }
}