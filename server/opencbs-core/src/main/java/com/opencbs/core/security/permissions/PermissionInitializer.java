package com.opencbs.core.security.permissions;

import com.opencbs.core.domain.Permission;
import com.opencbs.core.domain.PermissionRole;
import com.opencbs.core.services.PermissionService;
import org.reflections.Reflections;
import org.reflections.scanners.MethodAnnotationsScanner;
import org.reflections.util.ClasspathHelper;
import org.reflections.util.ConfigurationBuilder;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Component
public class PermissionInitializer {

    private final PermissionService permissionService;

    public PermissionInitializer(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @PostConstruct
    public void init() {
        Set<Method> methods = getAllMethodsFromProject();
        List<Permission> permissionsInDatabase = permissionService.findAll();
        List<Permission> permissionsInProject = getPermissionsInProject(methods);

        this.saveNewPermissions(permissionsInProject, permissionsInDatabase);
        permissionsInDatabase = permissionService.findAll();
        this.updateExistingPermissions(permissionsInProject, permissionsInDatabase);
        this.removeOldPermissions(permissionsInDatabase, permissionsInProject);

        this.updateAdminPermission();
    }

    private List<Permission> getPermissionsInProject(Set<Method> methods) {
        List<Permission> result = new ArrayList<>();

        for (Method method : methods) {
            PermissionRequired annotation = (PermissionRequired) Arrays.stream(method.getAnnotations())
                    .filter(x -> x instanceof PermissionRequired)
                    .findFirst().get();
            Permission newPermission = this.getPermission(annotation);
            if(result.stream().noneMatch(x -> x.getName().equals(newPermission.getName())))
                result.add(newPermission);
        }
        return result;
    }

    private void saveNewPermissions(List<Permission> permissionsInProject, List<Permission> permissionsInDatabase) {
        for (Permission permission : permissionsInProject) {
            if (permissionsInDatabase.stream().noneMatch(x -> x.getName().equals(permission.getName()))) {
                permissionService.save(permission);
            }
        }
    }

    private void updateExistingPermissions(List<Permission> permissionsInProject, List<Permission> permissionsInDatabase) {
        for (Permission permission : permissionsInProject) {
            Permission samePermission = permissionsInDatabase.stream()
                    .filter(x -> x.getName().equals(permission.getName()))
                    .findFirst().get();
            samePermission.setDescription(permission.getDescription());
            samePermission.setModuleType(permission.getModuleType());
            if(!samePermission.getDescription().equals(permission.getDescription()) ||
                    samePermission.getModuleType() != permission.getModuleType())
                permissionService.save(samePermission);
        }
    }

    private void removeOldPermissions(List<Permission> permissionsInDatabase, List<Permission> permissionsInProject) {
        List<Permission> unnecessaryPermissionsInDatabase = new ArrayList<>(permissionsInDatabase);
        unnecessaryPermissionsInDatabase.removeAll(permissionsInProject);
        unnecessaryPermissionsInDatabase
                .stream()
                .filter(x -> !x.getPermanent())
                .forEach(permissionService::delete);
    }

    private Set<Method> getAllMethodsFromProject() {
        Reflections reflections = new Reflections(
                new ConfigurationBuilder().setUrls(
                        ClasspathHelper.forPackage("com.opencbs")).setScanners(
                        new MethodAnnotationsScanner()));
        return reflections.getMethodsAnnotatedWith(PermissionRequired.class);
    }

    private Permission getPermission(PermissionRequired annotation) {
        Permission result = new Permission();
        result.setModuleType(annotation.moduleType());
        result.setName(annotation.name());
        result.setDescription(annotation.description());
        result.setPermanent(false);

        return result;
    }

    private void updateAdminPermission() {
        this.permissionService.deleteAllRolePermissions(this.permissionService.getAdminRoleId());

        List<Permission> allPermissions = this.permissionService.findAll();
        List<PermissionRole> adminPermissions = new ArrayList<>();
        for (Permission permission : allPermissions) {
            PermissionRole permissionRole = new PermissionRole();
            permissionRole.setRoleId(this.permissionService.getAdminRoleId());
            permissionRole.setPermissionId(permission.getId());
            adminPermissions.add(permissionRole);
        }

        this.permissionService.save(adminPermissions);
    }
}
