package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Permission;
import com.opencbs.core.domain.Role;
import com.opencbs.core.dto.PermissionDto;
import com.opencbs.core.dto.RoleDetailsDto;
import com.opencbs.core.dto.RoleDetailsForSaveDto;
import com.opencbs.core.dto.RoleDto;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.services.PermissionService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper
public class RoleMapper {

    private final PermissionService permissionService;
    private final PermissionMapper permissionMapper;
    private final RequestService requestService;

    @Autowired
    public RoleMapper(PermissionService permissionService,
                      PermissionMapper permissionMapper,
                      RequestService requestService) {
        this.permissionService = permissionService;
        this.permissionMapper = permissionMapper;
        this.requestService = requestService;
    }

    public RoleDto mapToDto(Role role) {
        return new ModelMapper().map(role, RoleDto.class);
    }

    public RoleDetailsDto mapToDetailsDto(Role role) {
        RoleDetailsDto dto = new ModelMapper().map(role, RoleDetailsDto.class);
        List<PermissionDto> permissionDtos = permissionMapper.matToDto(new ArrayList<>(role.getPermissions()));
        dto.setPermissions(new HashSet(permissionDtos));
        return dto;
    }

    public RoleDetailsDto mapToDetailsDtoForRole(Role role) {
        RoleDetailsDto dto = new ModelMapper().map(role, RoleDetailsDto.class);
        List<PermissionDto> permissionDtos = permissionMapper.matToDtoForRole(new ArrayList<>(role.getPermissions()));
        dto.setPermissions(new HashSet(permissionDtos));
        dto.setReadOnly(this.requestService.isActiveRequest(RequestType.ROLE_EDIT, role.getId()));
        return dto;
    }

    public Role mapToEntity(RoleDetailsForSaveDto dto) {
        Role role = new Role();
        role.setName(dto.getName());
        role.setPermissions(this.findPermissions(dto.getPermissions()));
        role.setStatusType(dto.getStatusType());
        return role;
    }

    public Role zip(Role role, RoleDetailsForSaveDto dto) {
        role.setName(dto.getName());
        role.setStatusType(dto.getStatusType());
        role.setPermissions(this.findPermissions(dto.getPermissions()));
        return role;
    }

    private Set<Permission> findPermissions(Set<String> permissions) {
        if (permissions == null || permissions.size() == 0) {
            return new HashSet<>();
        }
        List<Permission> allPermissions = this.permissionService.findAll();
        return permissions
                .stream()
                .map(x -> allPermissions
                        .stream()
                        .filter(t -> t.getName().equals(x))
                        .findFirst()
                        .get())
                .collect(Collectors.toSet());
    }
}