package com.opencbs.core.services;

import com.opencbs.core.domain.Permission;
import com.opencbs.core.domain.PermissionRole;
import com.opencbs.core.domain.Role;
import com.opencbs.core.repositories.PermissionRepository;
import com.opencbs.core.repositories.PermissionRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PermissionService {
    private final PermissionRepository permissionRepository;
    private final PermissionRoleRepository permissionRoleRepository;

    public PermissionService(PermissionRepository permissionRepository, PermissionRoleRepository permissionRoleRepository) {
        this.permissionRepository = permissionRepository;
        this.permissionRoleRepository = permissionRoleRepository;
    }

    public List<Permission> findAll() {
        return this.permissionRepository.findAll();
    }

    public Optional<Permission> findByName(String name) {
        return Optional.ofNullable(this.permissionRepository.findByName(name));
    }

    @Transactional
    public Permission save(Permission permission) {
        return this.permissionRepository.save(permission);
    }

    public List<PermissionRole> save(List<PermissionRole> permissionRoles) {
        return this.permissionRoleRepository.save(permissionRoles);
    }

    @Transactional
    public void delete(Permission permission) {
        this.permissionRoleRepository.deleteByPermissionId(permission.getId());
        this.permissionRepository.delete(permission);
    }

    @Transactional
    public void deleteAllRolePermissions(Long roleId) {
        this.permissionRoleRepository.deleteByRoleId(roleId);
    }

    public Long getAdminRoleId() {
        return 1L;
    }

    public List<PermissionRole> findByRole(Role role) {
        return this.permissionRoleRepository.findByRoleId(role.getId());
    }
}
