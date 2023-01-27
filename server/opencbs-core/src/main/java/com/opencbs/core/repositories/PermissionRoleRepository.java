package com.opencbs.core.repositories;

import com.opencbs.core.domain.PermissionRole;

import java.util.List;

public interface PermissionRoleRepository extends Repository<PermissionRole> {

    void deleteByPermissionId(Long permissionId);

    void deleteByRoleId(Long roleId);

    List<PermissionRole> findByRoleId(Long roleId);

}
