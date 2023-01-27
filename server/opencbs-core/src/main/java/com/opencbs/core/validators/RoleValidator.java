package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.Permission;
import com.opencbs.core.dto.RoleDetailsForSaveDto;
import com.opencbs.core.repositories.RoleRepository;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.services.PermissionService;
import io.jsonwebtoken.lang.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Set;

@Validator
public class RoleValidator {
    private final RoleRepository roleRepository;
    private final PermissionService permissionService;
    private final RequestService requestService;

    @Autowired
    public RoleValidator(RoleRepository roleRepository,
                         PermissionService permissionService,
                         RequestService requestService) {
        this.roleRepository = roleRepository;
        this.permissionService = permissionService;
        this.requestService = requestService;
    }

    public void validateOnCreate(RoleDetailsForSaveDto role) {
        Assert.isTrue(!StringUtils.isEmpty(role.getName()), "Name is required.");
        Assert.isTrue(!this.roleRepository.findByName(role.getName()).isPresent(), "Role already exist.");
        this.validatePermissionsForSave(role.getPermissions());
    }

    public void validateOnUpdate(RoleDetailsForSaveDto role, Long id) {
        Assert.isTrue(!StringUtils.isEmpty(role.getName()), "Name is required.");
        if (this.roleRepository.findByName(role.getName()).isPresent())
            Assert.isTrue(this.roleRepository.findByName(role.getName()).get().getId() == role.getId(),
                    "Role name must be unique.");
        this.validatePermissionsForSave(role.getPermissions());
    }

    private void validatePermissionsForSave(Set<String> permissions) {
        if (permissions == null || permissions.size() == 0)
            return;
        List<Permission> allPermissions = this.permissionService.findAll();
        permissions.forEach(
                x -> Assert.isTrue(allPermissions
                                .stream()
                                .anyMatch(t -> t.getName().equals(x)),
                        String.format("There are no permissions with this name.(NAME=%s)", x))
        );
    }
}
