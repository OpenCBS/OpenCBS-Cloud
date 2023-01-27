package com.opencbs.core.controllers;

import com.opencbs.core.dto.PermissionDto;
import com.opencbs.core.mappers.PermissionMapper;
import com.opencbs.core.services.PermissionService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
@RequestMapping(value = "/api/permissions")
public class PermissionController {

    private final PermissionService permissionService;
    private final PermissionMapper permissionMapper;

    public PermissionController(PermissionService permissionService,
                                PermissionMapper permissionMapper) {
        this.permissionService = permissionService;
        this.permissionMapper = permissionMapper;
    }

    @RequestMapping(method = GET)
    public List<PermissionDto> get() {
        return this.permissionMapper.matToDto(this.permissionService.findAll());
    }
}
