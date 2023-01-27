package com.opencbs.core.repositories;


import com.opencbs.core.domain.Permission;

public interface PermissionRepository extends Repository<Permission> {
    Permission findByName(String name);
}
